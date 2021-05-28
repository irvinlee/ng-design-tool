import { BehaviorSubject, Observable } from 'rxjs';
import { DesignToolService } from './../design-tool.service';
import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { generateRandomId, getBearing, getCoordinatesAfterRotation, getRelativeCursorCoordinates, getRotationHandlePosition } from '../common/utils';
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
  private isRotatingElement = false;
  private selectedElementClone: DesignElement | undefined;

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
      designEl?.bindMouseEventObservable(this.mouseEventObservable as Observable<{event: MouseEvent, type: string}>);
      designEl?.addEventListener('mousemove', this.onHoverElement.bind(this));
      designEl?.addEventListener('mouseout', this.onElementMouseOut.bind(this));
      designEl?.addEventListener('click', this.onElementClick.bind(this));
      designEl?.addEventListener('drag', this.onElementDrag.bind(this));
      designEl?.addEventListener('drop', this.onElementDrop.bind(this));
      designEl?.addEventListener('resize', this.onElementResize.bind(this));
      designEl?.addEventListener('startRotate', this.onElementRotateStart.bind(this));
    });
  }

  clearCanvas(): void {
    this.canvasContext?.clearRect(0, 0, this.width, this.height);
  }

  renderDesign(designState: DesignState): void {
    this.clearCanvas();
    designState.elements.forEach((designEl) => {
      designEl?.render(this.canvasContext as CanvasRenderingContext2D);
      designEl?.setParentCanvas(this.canvasRef);
    });
  }

  ngAfterViewInit(): void {
    this.canvasRef = document.getElementById(this.id) as HTMLCanvasElement;
    this.canvasContext = this.canvasRef.getContext('2d') as CanvasRenderingContext2D;
    this._bindCanvasMouseEvents();
  }

  ngOnDestroy(): void {
    this._unbindCanvasMouseEvents();
  }

  private getLocalDesignState(): DesignState {
    return this.localDesignStateSubject.getValue();
  }

  private onElementRotateStart(): void {
    this.isRotatingElement = true;
    this.selectedElementClone = this.selectedElement?.clone();
    console.log('Start rotate');
  }

  private onElementRotateEnd(): void {
    this.isRotatingElement = false;
    this.selectedElementClone = undefined;

    // unsubscribe all mouse event subscriptions in the elements
    this.getLocalDesignState().elements.forEach(designEl => {
      (designEl as DesignElement).unbindMouseEventObservable();
    });
    console.log(this.getLocalDesignState());
    // commit element update to the master copy of the Design State
    // instantiate a brand new object to clear all previous references..
    this.designToolService.updateDesignState(new DesignState(this.getLocalDesignState()));
  }

  private rotateElement(mouseX: number, mouseY: number): void {
    const baseElement = this.selectedElementClone as DesignElement;
    const element = this.selectedElement as DesignElement;
    element.resizeHandles.rotateHandle.top = mouseY - 4;
    element.resizeHandles.rotateHandle.left = mouseX - 4;

    const rotatedPosition = getCoordinatesAfterRotation(
      baseElement.left as number,
      baseElement.top as number,
      baseElement.bearing,
      baseElement.midpointX,
      baseElement.midpointY
    );

    element.bearing = getBearing(
      rotatedPosition.x as number,
      rotatedPosition.y as number,
      mouseX,
      mouseY
    );

    this.renderDesign(this.getLocalDesignState());
  }

  private onElementResize(element: DesignElement, mouseHandleUsed: string, mouseX: number, mouseY: number): void {
    element.resize(mouseHandleUsed, mouseX, mouseY);
    this.renderDesign(this.getLocalDesignState());
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
    console.log(element);

    this.getLocalDesignState().elements.forEach((designEl: DesignElement | undefined) => {
      if (designEl === element) {
        designEl.isSelected = true;
        this.selectedElement = designEl;
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
    // unsubscribe all mouse event subscriptions in the elements
    this.getLocalDesignState().elements.forEach(designEl => {
      (designEl as DesignElement).unbindMouseEventObservable();
    });
    // commit element update to the master copy of the Design State
    // instantiate a brand new object to clear all previous references..
    this.designToolService.updateDesignState(new DesignState(this.getLocalDesignState()));
  }

  private onCanvasMouseMove(event: MouseEvent): void {
    if (this.isRotatingElement) {
      const {x, y} = getRelativeCursorCoordinates(event);
      this.rotateElement(x, y);
    } else {
      this.mouseEventSubject.next({event, type: 'mousemove'});
    }
  }

  private onCanvasClick(event: MouseEvent): void {
    this.mouseEventSubject.next({event, type: 'click'});
  }

  private onCanvasMouseDown(event: MouseEvent): void {
    this.mouseEventSubject.next({event, type: 'mousedown'});
  }

  private onCanvasMouseUp(event: MouseEvent): void {
    if (this.isRotatingElement) {
      this.onElementRotateEnd();
    }

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
