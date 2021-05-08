import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeItemComponent } from './shape-item.component';

describe('ShapeItemComponent', () => {
  let component: ShapeItemComponent;
  let fixture: ComponentFixture<ShapeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShapeItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
