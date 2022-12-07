import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytmPaymentComponent } from './paytm-payment.component';

describe('PaytmPaymentComponent', () => {
  let component: PaytmPaymentComponent;
  let fixture: ComponentFixture<PaytmPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaytmPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaytmPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
