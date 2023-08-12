import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcFailComponent } from './cc-fail.component';

describe('CcFailComponent', () => {
  let component: CcFailComponent;
  let fixture: ComponentFixture<CcFailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcFailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
