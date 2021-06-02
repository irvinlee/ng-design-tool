import { MouseHandle } from './../common/classes/mouse-handle';
import { CanvasMouseEvent } from './../types/canvas-mouse-event';
import { MouseEventHandler } from './../common/classes/mouse-event-handler';
import { BehaviorSubject, Subscription } from 'rxjs';
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

  private mouseEventHandler?: MouseEventHandler;
  private subscriptions: Array<Subscription> = [];
  private selectedElement?: DesignElement;

  localDesignState = this.localDesignStateSubject.asObservable();
  mouseEventObservable = this.mouseEventSubject.asObservable();

  canvasRef?: HTMLCanvasElement;
  canvasContext?: CanvasRenderingContext2D;
  zoomLevel = 1;

  isCropping = true;
  cropLeft = 100;
  cropTop = 100;
  cropWidth = 300;
  cropHeight = 200;

  constructor(private designToolService: DesignToolService) {
    this.subscriptions.push(this.designToolService.designState.subscribe((newDesignState) => {
      // when the global design state changes, update the local copy...
      this.localDesignStateSubject.next(newDesignState);
    }));

    this.subscriptions.push(this.designToolService.zoomLevel.subscribe(newZoomLevel => {
      this.zoomLevel = newZoomLevel;
      // add a small timeout before redrawing the canvas contents to make sure that the canvas has already been resized before redrawing...
      setTimeout(() => {
        this.renderDesign(this.getLocalDesignState());
      }, 10);
    }));

    this.subscriptions.push(this.designToolService.isCropping.subscribe(isCropping => {
      this.isCropping = isCropping;
    }));

    this.subscriptions.push(this.localDesignState.subscribe((newDesignState) => {
      this.renderDesign(newDesignState);
      this.bindDesignElementMouseEvents(newDesignState);

      if (this.mouseEventHandler) {
        this.mouseEventHandler.setElements(newDesignState.elements as Map<string, DesignElement>);
        this.subscriptions.push(this.mouseEventHandler.mouseEventObservable.subscribe(
          (canvasMouseEvent: CanvasMouseEvent) => {
            const { targetKey, mouseEvent, type } = canvasMouseEvent;

            if (canvasMouseEvent.type === 'click') {
              this.designToolService.setSelectedElementKey('');
              this.clearElementSelection();
            }

            if (targetKey) {
              const affectedElement = this.getLocalDesignState().elements.get(targetKey as string);

              if (canvasMouseEvent.type === 'click') {
                // TODO: refactor this so that it only uses the copy from the service...
                this.selectedElement = affectedElement?.clone();
                this.designToolService.setSelectedElementKey(targetKey);
              }

              affectedElement?.handleMouseEvent(canvasMouseEvent);
            }
          }
        ));
      }
    }));
  }

  clearElementSelection(): void {
    this.getLocalDesignState().elements.forEach((designEl) => {
      (designEl as DesignElement).isSelected = false;
    });
    this.renderDesign(this.getLocalDesignState());
  }

  bindDesignElementMouseEvents(designState: DesignState): void {
    designState.elements.forEach((designEl) => {
      designEl?.addEventListener('mousemove', this.onHoverElement.bind(this));
      designEl?.addEventListener('mouseout', this.onElementMouseOut.bind(this));
      designEl?.addEventListener('click', this.onElementClick.bind(this));
      designEl?.addEventListener('drag', this.onElementDrag.bind(this));
      designEl?.addEventListener('drop', this.onElementDrop.bind(this));
      designEl?.addEventListener('resize', this.onElementResize.bind(this));
      designEl?.addEventListener('rotate', this.onElementRotate.bind(this));
    });
  }

  clearCanvas(): void {
    this.canvasContext?.clearRect(0, 0, this.width * this.zoomLevel, this.height * this.zoomLevel);
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
    this.mouseEventHandler = new MouseEventHandler(this.canvasRef);
    this.mouseEventHandler.setElements(this.localDesignStateSubject.getValue().elements as Map<string, DesignElement>);
  }

  ngOnDestroy(): void {
    this.mouseEventHandler?.unbindCanvasMouseEvents();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  get canvasWidth(): number {
    return this.width * this.zoomLevel;
  }

  get canvasHeight(): number {
    return this.height * this.zoomLevel;
  }

  private getLocalDesignState(): DesignState {
    return this.localDesignStateSubject.getValue();
  }

  private onElementResize(
    element: DesignElement,
    canvasMouseEvent: CanvasMouseEvent,
    {cursorX, cursorY}: {cursorX: number, cursorY: number}
  ): void {
    const mouseHandleUsed = canvasMouseEvent.transformHandle as MouseHandle;
    element.resize(mouseHandleUsed.id, cursorX, cursorY);
    this.renderDesign(this.getLocalDesignState());
  }

  private onHoverElement(element: DesignElement): void {
    (this.canvasRef as HTMLCanvasElement).style.cursor = 'pointer';
    element.isHovered = true;
    this.renderDesign(this.getLocalDesignState());
  }

  private onElementMouseOut(element: DesignElement): void {
    (this.canvasRef as HTMLCanvasElement).style.cursor = 'default';
    element.isHovered = false;
    this.renderDesign(this.getLocalDesignState());
  }

  private onElementClick(element: DesignElement): void {
    element.isSelected = true;
    this.renderDesign(this.getLocalDesignState());
  }

  private onElementDrag(element: DesignElement, {cursorX, cursorY}: {cursorX: number, cursorY: number}): void {
    // console.log(element);
    // console.log(cursorX);
    // console.log(cursorY);
    element.top = cursorY - ((element.height as number) / 2);
    element.left = cursorX - ((element.width as number) / 2);
    this.renderDesign(this.getLocalDesignState());
  }

  private onElementDrop(element: DesignElement): void {
    // commit element update to the master copy of the Design State
    // instantiate a brand new object to clear all previous references..
    (this.mouseEventHandler as MouseEventHandler).unbindCanvasMouseEvents();
    this.mouseEventHandler = new MouseEventHandler(this.canvasRef as HTMLCanvasElement);
    this.designToolService.updateDesignState(this.getLocalDesignState().clone());
  }

  private onElementRotate(element: DesignElement, {cursorX, cursorY}: {cursorX: number, cursorY: number}): void {
    element.rotate((this.selectedElement as DesignElement), cursorX, cursorY);
    this.renderDesign(this.getLocalDesignState());
  }
}
