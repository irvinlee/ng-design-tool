import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropToolComponent } from './crop-tool.component';

describe('CropToolComponent', () => {
  let component: CropToolComponent;
  let fixture: ComponentFixture<CropToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CropToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CropToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
