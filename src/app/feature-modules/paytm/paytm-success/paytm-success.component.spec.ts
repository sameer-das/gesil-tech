import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytmSuccessComponent } from './paytm-success.component';

describe('PaytmSuccessComponent', () => {
  let component: PaytmSuccessComponent;
  let fixture: ComponentFixture<PaytmSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaytmSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaytmSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
