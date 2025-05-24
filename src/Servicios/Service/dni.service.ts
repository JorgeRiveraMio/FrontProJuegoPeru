import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { appsettingsDni } from '../../Ajustes/app.settings';


@Injectable({
  providedIn: 'root'
})
export class DniService {

  private apiUrlDni =appsettingsDni.apiUrl;
  constructor(private http: HttpClient) { }

  consultarDni(dni: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlDni}?dni=${dni}`);
  }
}
