import { TestBed } from '@angular/core/testing';

import { DataStateUpdateService } from './data-state-update.service';

describe('DataStateUpdateService', () => {
  let service: DataStateUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataStateUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
