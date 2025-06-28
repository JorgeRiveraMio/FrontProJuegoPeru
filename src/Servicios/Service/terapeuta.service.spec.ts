import { TestBed } from '@angular/core/testing';

import { TerapeutaService } from './terapeuta.service';

describe('terapeutaService', () => {
  let service: TerapeutaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerapeutaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
