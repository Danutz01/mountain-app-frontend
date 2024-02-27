import { TestBed } from '@angular/core/testing';

import { MeetmountainFormService } from './meetmountain-form.service';

describe('MeetmountainFormService', () => {
  let service: MeetmountainFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetmountainFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
