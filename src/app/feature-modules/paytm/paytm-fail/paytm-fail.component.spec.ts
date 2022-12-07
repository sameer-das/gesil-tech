import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytmFailComponent } from './paytm-fail.component';

describe('PaytmFailComponent', () => {
  let component: PaytmFailComponent;
  let fixture: ComponentFixture<PaytmFailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaytmFailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaytmFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
