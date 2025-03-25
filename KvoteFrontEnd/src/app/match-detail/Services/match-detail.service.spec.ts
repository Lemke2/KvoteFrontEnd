import { TestBed } from '@angular/core/testing';

import { MatchDetailService } from './match-detail.service';

describe('MatchDetailService', () => {
  let service: MatchDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
