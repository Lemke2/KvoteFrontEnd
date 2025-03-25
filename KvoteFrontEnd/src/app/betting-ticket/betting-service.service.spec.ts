import { TestBed } from '@angular/core/testing';

import { BettingServiceService } from './betting-service.service';

describe('BettingServiceService', () => {
  let service: BettingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BettingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
