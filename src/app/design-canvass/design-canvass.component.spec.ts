import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignCanvassComponent } from './design-canvass.component';

describe('DesignCanvassComponent', () => {
  let component: DesignCanvassComponent;
  let fixture: ComponentFixture<DesignCanvassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignCanvassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignCanvassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
