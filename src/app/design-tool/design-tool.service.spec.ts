import { TestBed } from '@angular/core/testing';

import { DesignToolService } from './design-tool.service';

describe('DesignToolService', () => {
  let service: DesignToolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
