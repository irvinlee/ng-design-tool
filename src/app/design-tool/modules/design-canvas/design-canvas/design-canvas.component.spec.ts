import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesigncanvasComponent } from './design-canvas.component';

describe('DesigncanvasComponent', () => {
  let component: DesigncanvasComponent;
  let fixture: ComponentFixture<DesigncanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesigncanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesigncanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
