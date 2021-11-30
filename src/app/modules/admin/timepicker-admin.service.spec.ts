import { TestBed } from '@angular/core/testing';

import { TimepickerAdminService } from './timepicker-admin.service';

describe('TimepickerAdminService', () => {
  let service: TimepickerAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimepickerAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
