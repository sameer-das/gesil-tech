import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiatePaymentComponent } from './initiate-payment.component';

describe('InitiatePaymentComponent', () => {
  let component: InitiatePaymentComponent;
  let fixture: ComponentFixture<InitiatePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiatePaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiatePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
