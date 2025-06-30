import { TestBed } from '@angular/core/testing';

import { tipoSesionService } from './tipo-sesion.service';

describe('tipoSesionService', () => {
  let service: tipoSesionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(tipoSesionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
