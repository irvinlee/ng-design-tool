import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainOptionsPanelComponent } from './main-options-panel.component';

describe('MainOptionsPanelComponent', () => {
  let component: MainOptionsPanelComponent;
  let fixture: ComponentFixture<MainOptionsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainOptionsPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainOptionsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
