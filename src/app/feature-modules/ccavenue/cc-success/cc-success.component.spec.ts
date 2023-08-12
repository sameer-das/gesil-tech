import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcSuccessComponent } from './cc-success.component';

describe('CcSuccessComponent', () => {
  let component: CcSuccessComponent;
  let fixture: ComponentFixture<CcSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
