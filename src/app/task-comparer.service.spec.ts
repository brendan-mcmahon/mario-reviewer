import { TestBed } from '@angular/core/testing';

import { TaskComparerService } from './task-comparer.service';

describe('TaskComparerService', () => {
  let service: TaskComparerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskComparerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
