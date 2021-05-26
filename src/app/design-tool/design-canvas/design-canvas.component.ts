import { BehaviorSubject, Observable } from 'rxjs';
import { DesignToolService } from './../design-tool.service';
import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { generateRandomId } from '../common/utils';
import { DesignState } from '../common/classes/design-state';

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
    });
  }

  renderDesign(designState: DesignState): void {
    this.canvasContext?.clearRect(0, 0, this.width, this.height);

    designState.elements.forEach((designEl) => {
      designEl?.render(this.canvasContext as CanvasRenderingContext2D);
      designEl?.subscribeToMouseEvents(this.mouseEventObservable as Observable<{event: MouseEvent, type: string}>);
    });
  }

  ngAfterViewInit(): void {
    this.canvasRef = document.getElementById(this.id) as HTMLCanvasElement;
    this.canvasContext = this.canvasRef.getContext('2d') as CanvasRenderingContext2D;
    this._bindCanvasMouseEvents();
  }

  ngOnDestroy(): void {
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
