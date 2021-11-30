import { TestBed } from '@angular/core/testing';

import { ValidatorinputService } from './validatorinput.service';

describe('ValidatorinputService', () => {
  let service: ValidatorinputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidatorinputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
