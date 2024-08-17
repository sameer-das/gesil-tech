import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AadharEnrollmentFormStepperComponent } from './aadhar-enrollment-form-stepper.component';

describe('AadharEnrollmentFormStepperComponent', () => {
  let component: AadharEnrollmentFormStepperComponent;
  let fixture: ComponentFixture<AadharEnrollmentFormStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AadharEnrollmentFormStepperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AadharEnrollmentFormStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
