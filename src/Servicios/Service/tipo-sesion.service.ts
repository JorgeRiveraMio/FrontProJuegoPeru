import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appsettingsCliente } from '../../Ajustes/app.settings';
import { Observable } from 'rxjs';
import { TipoSesion } from '../../Modelos/Entity/TipoSesion';

@Injectable({
  providedIn: 'root'
})
export class tipoSesionService {
  private readonly _apiUrl = appsettingsCliente.apiUrl + '/tipos-sesion';
  private readonly http = inject(HttpClient);

  constructor() { }

  listarTodos(): Observable<TipoSesion[]> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
        Authorization: `Bearer ${token}`
    };
    return this.http.get<TipoSesion[]>(this._apiUrl, { headers });
  }

  obtenerPorId(id: number): Observable<TipoSesion> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
        Authorization: `Bearer ${token}`
    };
    return this.http.get<TipoSesion>(`${this._apiUrl}/${id}`, { headers });
  }

  guardar(tipo: TipoSesion): Observable<TipoSesion> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
        Authorization: `Bearer ${token}`
    };
    return this.http.post<TipoSesion>(this._apiUrl, tipo, { headers });
  }

  actualizar(tipo: TipoSesion): Observable<TipoSesion> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
        Authorization: `Bearer ${token}`
    };
    return this.http.put<TipoSesion>(this._apiUrl, tipo, { headers });
  }

  eliminar(id: number): Observable<void> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
        Authorization: `Bearer ${token}`
    };
    return this.http.delete<void>(`${this._apiUrl}/${id}`, { headers });
  }
}