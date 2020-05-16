import { TestBed } from '@angular/core/testing';

import { TeamListService } from './team-list.service';

describe('TeamListService', () => {
  let service: TeamListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
