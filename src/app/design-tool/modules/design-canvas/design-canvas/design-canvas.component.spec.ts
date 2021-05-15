import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignCanvasComponent } from './design-canvas.component';

describe('DesignCanvasComponent', () => {
  let component: DesignCanvasComponent;
  let fixture: ComponentFixture<DesignCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
