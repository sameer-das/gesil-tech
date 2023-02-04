import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPinComponent } from './forgot-pin.component';

describe('ForgotPinComponent', () => {
  let component: ForgotPinComponent;
  let fixture: ComponentFixture<ForgotPinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgotPinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
