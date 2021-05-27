import { BehaviorSubject, Observable } from 'rxjs';
import { DesignToolService } from './../design-tool.service';
import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { generateRandomId } from '../common/utils';
import { DesignState } from '../common/classes/design-state';
import { DesignElement } from '../common/classes/design-element';

@Component({
  selector: 'app-ypdt-design-canvas',
  templateUrl: './design-canvas.component.html',
  styleUrls: ['./design-canvas.component.scss']
})
export class DesignCanvasComponent implements AfterViewInit, OnDestroy{
  @Input() height = 400;
  @Input() width = 700;

  readonly id = generateRandomId();
  private localDesignStateSubject = new BehaviorSubject(new DesignState());
  private mouseEventSubject: BehaviorSubject<{event: MouseEvent, type: string}|undefined> =
    new BehaviorSubject<{event: MouseEvent, type: string}|undefined>(undefined);
  private selectedElement: DesignElement | undefined;

  localDesignState = this.localDesignStateSubject.asObservable();
  mouseEventObservable = this.mouseEventSubject.asObservable();

  canvasRef?: HTMLCanvasElement;
  canvasContext?: CanvasRenderingContext2D;

  constructor(private designToolService: DesignToolService) {
    this.designToolService.designState.subscribe((newDesignState) => {
      // when the global design state changes, update the local copy...
      this.localDesignStateSubject.next(newDesignState);
    });

    this.localDesignState.subscribe((newDesignState) => {
      this.renderDesign(newDesignState);
      this.bindDesignElementMouseEvents(newDesignState);
    });
  }

  bindDesignElementMouseEvents(designState: DesignState): void {
    designState.elements.forEach((designEl) => {
      designEl?.subscribeToMouseEvents(this.mouseEventObservable as Observable<{event: MouseEvent, type: string}>);
      designEl?.addEventListener('mousemove', this.onHoverElement.bind(this));
      designEl?.addEventListener('mouseout', this.onElementMouseOut.bind(this));
      designEl?.addEventListener('click', this.onElementClick.bind(this));
      designEl?.addEventListener('drag', this.onElementDrag.bind(this));
      designEl?.addEventListener('drop', this.onElementDrop.bind(this));
    });
  }

  renderDesign(designState: DesignState): void {
    this.canvasContext?.clearRect(0, 0, this.width, this.height);

    designState.elements.forEach((designEl) => {
      designEl?.render(this.canvasContext as CanvasRenderingContext2D);
    });
  }

  ngAfterViewInit(): void {
    this.canvasRef = document.getElementById(this.id) as HTMLCanvasElement;
    this.canvasContext = this.canvasRef.getContext('2d') as CanvasRenderingContext2D;
    this._bindCanvasMouseEvents();
  }

  ngOnDestroy(): void {
  }

  private getLocalDesignState(): DesignState {
    return this.localDesignStateSubject.getValue();
  }

  private onHoverElement(element: DesignElement): void {
    (this.canvasRef as HTMLCanvasElement).style.cursor = 'pointer';
    this.renderDesign(this.getLocalDesignState());
  }

  private onElementMouseOut(): void {
    (this.canvasRef as HTMLCanvasElement).style.cursor = 'default';
    this.renderDesign(this.getLocalDesignState());
  }

  private onElementClick(element: DesignElement): void {
    this.getLocalDesignState().elements.forEach((designEl: DesignElement | undefined) => {
      if (designEl === element) {
        designEl.isSelected = true;
      } else {
        (designEl as DesignElement).isSelected = false;
      }
    });
    this.renderDesign(this.getLocalDesignState());
  }

  private onElementDrag(element: DesignElement, {cursorX, cursorY}: {cursorX: number, cursorY: number}): void {
    element.top = cursorY - ((element.height as number) / 2);
    element.left = cursorX - ((element.width as number) / 2);
    this.renderDesign(this.getLocalDesignState());
  }

  private onElementDrop(element: DesignElement, {cursorX, cursorY}: {cursorX: number, cursorY: number}): void {
    // commit element update to the master copy of the Design State
    this.designToolService.updateDesignState(this.getLocalDesignState().clone());
  }

  private onCanvasMouseMove(event: MouseEvent): void {
    this.mouseEventSubject.next({event, type: 'mousemove'});
  }

  private onCanvasClick(event: MouseEvent): void {
    this.mouseEventSubject.next({event, type: 'click'});
  }

  private onCanvasMouseDown(event: MouseEvent): void {
    this.mouseEventSubject.next({event, type: 'mousedown'});
  }

  private onCanvasMouseUp(event: MouseEvent): void {
    this.mouseEventSubject.next({event, type: 'mouseup'});
  }

  private _bindCanvasMouseEvents(): void {
    this.canvasRef?.addEventListener('mousemove', this.onCanvasMouseMove.bind(this));
    this.canvasRef?.addEventListener('click', this.onCanvasClick.bind(this));
    this.canvasRef?.addEventListener('mousedown', this.onCanvasMouseDown.bind(this));
    this.canvasRef?.addEventListener('mouseup', this.onCanvasMouseUp.bind(this));
  }

  private _unbindCanvasMouseEvents(): void {
    this.canvasRef?.removeEventListener('mousemove', this.onCanvasMouseMove.bind(this));
    this.canvasRef?.removeEventListener('click', this.onCanvasClick.bind(this));
    this.canvasRef?.removeEventListener('mousedown', this.onCanvasMouseDown.bind(this));
    this.canvasRef?.removeEventListener('mouseup', this.onCanvasMouseUp.bind(this));
  }
}
