import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateKycComponent } from './update-kyc.component';

describe('UpdateKycComponent', () => {
  let component: UpdateKycComponent;
  let fixture: ComponentFixture<UpdateKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateKycComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
