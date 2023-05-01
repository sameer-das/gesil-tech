import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSenderComponent } from './add-sender.component';

describe('AddSenderComponent', () => {
  let component: AddSenderComponent;
  let fixture: ComponentFixture<AddSenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
