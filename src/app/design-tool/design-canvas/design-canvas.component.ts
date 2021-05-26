import { BehaviorSubject } from 'rxjs';
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
  private localDesignStateSubject: BehaviorSubject<DesignState> = new BehaviorSubject(new DesignState());

  localDesignState = this.localDesignStateSubject.asObservable();
  canvasRef?: HTMLCanvasElement;

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
    console.log('rendering...');
  }

  ngAfterViewInit(): void {
    this.canvasRef = document.getElementById(this.id) as HTMLCanvasElement;
  }

  ngOnDestroy(): void {
  }
}
