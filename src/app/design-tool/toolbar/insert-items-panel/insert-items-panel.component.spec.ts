import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertItemsPanelComponent } from './insert-items-panel.component';

describe('InsertItemsPanelComponent', () => {
  let component: InsertItemsPanelComponent;
  let fixture: ComponentFixture<InsertItemsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertItemsPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertItemsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
