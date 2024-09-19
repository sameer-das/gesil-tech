import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmtTransactionDetailsComponent } from './dmt-transaction-details.component';

describe('DmtTransactionDetailsComponent', () => {
  let component: DmtTransactionDetailsComponent;
  let fixture: ComponentFixture<DmtTransactionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmtTransactionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmtTransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
