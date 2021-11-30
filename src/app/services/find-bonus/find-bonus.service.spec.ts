import { TestBed } from '@angular/core/testing';

import { FindBonusService } from './find-bonus.service';

describe('FindBonusService', () => {
  let service: FindBonusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindBonusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
