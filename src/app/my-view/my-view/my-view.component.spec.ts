import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyViewComponent } from './my-view.component';

describe('MyViewComponent', () => {
  let component: MyViewComponent;
  let fixture: ComponentFixture<MyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
