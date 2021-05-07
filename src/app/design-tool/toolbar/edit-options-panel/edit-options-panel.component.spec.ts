import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOptionsPanelComponent } from './edit-options-panel.component';

describe('EditOptionsPanelComponent', () => {
  let component: EditOptionsPanelComponent;
  let fixture: ComponentFixture<EditOptionsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditOptionsPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOptionsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
