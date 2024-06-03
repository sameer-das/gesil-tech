import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisePopupComponentComponent } from './advertise-popup-component.component';

describe('AdvertisePopupComponentComponent', () => {
  let component: AdvertisePopupComponentComponent;
  let fixture: ComponentFixture<AdvertisePopupComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvertisePopupComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertisePopupComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
