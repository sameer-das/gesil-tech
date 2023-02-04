import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyPopupComponent } from './reply-popup.component';

describe('ReplyPopupComponent', () => {
  let component: ReplyPopupComponent;
  let fixture: ComponentFixture<ReplyPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplyPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
