import { inject, Injectable } from "@angular/core";
import { appsettingsCliente } from "../../Ajustes/app.settings";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Sesion } from "../../Modelos/Entity/Sesion";

@Injectable({
  providedIn: 'root'
})
export class SesionService {

    private readonly _apiUrl = appsettingsCliente.apiUrl + '/sesiones';
    private readonly http = inject(HttpClient);

    constructor() { }

  // POST: reservar sesión
  reservarSesion(sesionDto: any): Observable<Sesion> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.post<Sesion>(`${this._apiUrl}/reservar`, sesionDto, { headers });
  }

  // GET: listar sesiones (todas o por paciente)
  listarSesiones(pacienteId?: number): Observable<Sesion[]> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
      Authorization: `Bearer ${token}`
    };

    const url = pacienteId
      ? `${this._apiUrl}?pacienteId=${pacienteId}`
      : this._apiUrl;
    return this.http.get<Sesion[]>(url, { headers });
  }

  // PUT: cancelar sesión
  cancelarSesion(id: number): Observable<void> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.put<void>(`${this._apiUrl}/${id}/cancelar`, null, { headers });
  }

  // PUT: finalizar sesión
  finalizarSesion(id: number): Observable<void> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.put<void>(`${this._apiUrl}/${id}/finalizar`, null, { headers });
  }

  obtenerSesionesPorPaciente(pacienteId: number): Observable<any[]> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.get<any[]>(`${this._apiUrl}/paciente/${pacienteId}`, { headers });
  }

  obtenerTodasLasSesiones(): Observable<Sesion[]> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.get<Sesion[]>(`${this._apiUrl}/todas`, { headers });
  }

  obtenerSesionesPorTerapeuta(id: number): Observable<any[]> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
      Authorization: `Bearer ${token}`
    };
  return this.http.get<any[]>(`${this._apiUrl}/terapeuta/${id}`, { headers });
  }

}