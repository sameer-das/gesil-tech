import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackComplaintComponent } from './track-complaint.component';

describe('TrackComplaintComponent', () => {
  let component: TrackComplaintComponent;
  let fixture: ComponentFixture<TrackComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackComplaintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
