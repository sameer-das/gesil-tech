import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletPinChangeComponent } from './wallet-pin-change.component';

describe('WalletPinChangeComponent', () => {
  let component: WalletPinChangeComponent;
  let fixture: ComponentFixture<WalletPinChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletPinChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletPinChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
