import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcMainPageComponent } from './cc-main-page.component';

describe('CcMainPageComponent', () => {
  let component: CcMainPageComponent;
  let fixture: ComponentFixture<CcMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcMainPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
