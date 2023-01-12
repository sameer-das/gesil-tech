import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinPopupComponent } from './pin-popup.component';

describe('PinPopupComponent', () => {
  let component: PinPopupComponent;
  let fixture: ComponentFixture<PinPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PinPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PinPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
