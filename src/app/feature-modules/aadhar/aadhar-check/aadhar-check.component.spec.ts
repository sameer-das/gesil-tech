import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AadharCheckComponent } from './aadhar-check.component';

describe('AadharCheckComponent', () => {
  let component: AadharCheckComponent;
  let fixture: ComponentFixture<AadharCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AadharCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AadharCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
