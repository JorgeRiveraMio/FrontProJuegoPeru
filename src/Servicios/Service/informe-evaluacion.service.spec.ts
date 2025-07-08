import { TestBed } from '@angular/core/testing';

import { InformeEvaluacionService } from './informe-evaluacion.service';

describe('InformeEvaluacionService', () => {
  let service: InformeEvaluacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformeEvaluacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
