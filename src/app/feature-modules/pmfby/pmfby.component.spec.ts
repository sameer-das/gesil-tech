import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmfbyComponent } from './pmfby.component';

describe('PmfbyComponent', () => {
  let component: PmfbyComponent;
  let fixture: ComponentFixture<PmfbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmfbyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmfbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
