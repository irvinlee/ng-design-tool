import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignToolComponent } from './design-tool.component';

describe('DesignToolComponent', () => {
  let component: DesignToolComponent;
  let fixture: ComponentFixture<DesignToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
