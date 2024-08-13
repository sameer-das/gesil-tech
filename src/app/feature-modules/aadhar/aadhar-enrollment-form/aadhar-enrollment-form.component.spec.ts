import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AadharEnrollmentFormComponent } from './aadhar-enrollment-form.component';

describe('AadharEnrollmentFormComponent', () => {
  let component: AadharEnrollmentFormComponent;
  let fixture: ComponentFixture<AadharEnrollmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AadharEnrollmentFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AadharEnrollmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
