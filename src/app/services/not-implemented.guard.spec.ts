import { TestBed } from '@angular/core/testing';

import { NotImplementedGuard } from './not-implemented.guard';

describe('NotImplementedGuard', () => {
  let guard: NotImplementedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NotImplementedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
