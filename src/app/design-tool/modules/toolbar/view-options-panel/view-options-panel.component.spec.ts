import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOptionsPanelComponent } from './view-options-panel.component';

describe('ViewOptionsPanelComponent', () => {
  let component: ViewOptionsPanelComponent;
  let fixture: ComponentFixture<ViewOptionsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOptionsPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOptionsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
