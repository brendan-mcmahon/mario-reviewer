import { TestBed } from '@angular/core/testing';

import { VariableComparerService } from './variable-comparer.service';

describe('VariableComparerService', () => {
  let service: VariableComparerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VariableComparerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
