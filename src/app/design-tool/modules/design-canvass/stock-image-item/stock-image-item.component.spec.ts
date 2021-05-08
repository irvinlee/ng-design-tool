import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockImageItemComponent } from './stock-image-item.component';

describe('StockImageItemComponent', () => {
  let component: StockImageItemComponent;
  let fixture: ComponentFixture<StockImageItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockImageItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockImageItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
