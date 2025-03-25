import { TestBed } from '@angular/core/testing';

import { AllSportsService } from './all-sports.service';

describe('AllSportsService', () => {
  let service: AllSportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllSportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
