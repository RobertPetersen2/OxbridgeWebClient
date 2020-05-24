import { TestBed } from '@angular/core/testing';

import { RaceServiceService } from './race-service.service';

describe('RaceServiceService', () => {
  let service: RaceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
