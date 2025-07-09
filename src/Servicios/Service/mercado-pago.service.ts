import { inject, Injectable } from '@angular/core';
import { appsettingsCliente } from '../../Ajustes/app.settings';
import { HttpClient } from '@angular/common/http';
import { CrearPagoRequest } from '../../Modelos/Entity/CrearPagoRequest';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {
  
  private readonly _apiUrl = appsettingsCliente.apiUrl + '/pago';
  private readonly http = inject(HttpClient);
  
  constructor() { }
  
  generarPreferencia(request: CrearPagoRequest): Observable<string> {
    return this.http.post(this._apiUrl + '/preferencia', request, { responseType: 'text' });
  }
  
}
