import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmtTransactionComponent } from './dmt-transaction.component';

describe('DmtTransactionComponent', () => {
  let component: DmtTransactionComponent;
  let fixture: ComponentFixture<DmtTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmtTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmtTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
