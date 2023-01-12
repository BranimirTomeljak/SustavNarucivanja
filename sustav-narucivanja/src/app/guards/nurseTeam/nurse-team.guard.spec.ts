import { TestBed } from '@angular/core/testing';

import { NurseTeamGuard } from './nurse-team.guard';

describe('NurseTeamGuard', () => {
  let guard: NurseTeamGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NurseTeamGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
