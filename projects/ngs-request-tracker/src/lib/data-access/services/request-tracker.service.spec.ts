import { TestBed } from '@angular/core/testing';

import { RequestTrackerService } from './request-tracker.service';

describe('RequestTrackerService', () => {
  let service: RequestTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
