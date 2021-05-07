import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormattingOptionsPanelComponent } from './formatting-options-panel.component';

describe('FormattingOptionsPanelComponent', () => {
  let component: FormattingOptionsPanelComponent;
  let fixture: ComponentFixture<FormattingOptionsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormattingOptionsPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormattingOptionsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
