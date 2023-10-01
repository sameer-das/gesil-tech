import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcavenueMobileComponent } from './ccavenue-mobile.component';

describe('CcavenueMobileComponent', () => {
  let component: CcavenueMobileComponent;
  let fixture: ComponentFixture<CcavenueMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcavenueMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcavenueMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
