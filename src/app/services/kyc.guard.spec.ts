import { TestBed } from '@angular/core/testing';

import { KycGuard } from './kyc.guard';

describe('KycGuard', () => {
  let guard: KycGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(KycGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
