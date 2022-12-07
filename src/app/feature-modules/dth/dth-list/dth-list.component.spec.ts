import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DthListComponent } from './dth-list.component';

describe('DthListComponent', () => {
  let component: DthListComponent;
  let fixture: ComponentFixture<DthListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DthListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DthListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
