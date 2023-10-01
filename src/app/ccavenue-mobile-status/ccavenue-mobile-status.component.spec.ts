import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcavenueMobileStatusComponent } from './ccavenue-mobile-status.component';

describe('CcavenueMobileStatusComponent', () => {
  let component: CcavenueMobileStatusComponent;
  let fixture: ComponentFixture<CcavenueMobileStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcavenueMobileStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcavenueMobileStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
