import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDetailPopupComponent } from './transaction-detail-popup.component';

describe('TransactionDetailPopupComponent', () => {
  let component: TransactionDetailPopupComponent;
  let fixture: ComponentFixture<TransactionDetailPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionDetailPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDetailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
