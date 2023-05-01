import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmtHomeComponent } from './dmt-home.component';

describe('DmtHomeComponent', () => {
  let component: DmtHomeComponent;
  let fixture: ComponentFixture<DmtHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmtHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmtHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
