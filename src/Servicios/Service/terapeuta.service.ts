import { inject, Injectable } from '@angular/core';
import { appsettingsCliente } from '../../Ajustes/app.settings';
import { HttpClient } from '@angular/common/http';
import { TerapeutaDisponibilidad } from '../../Modelos/Entity/TerapeutaDisponibilidad';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TerapeutaService {

    private readonly _apiUrl = appsettingsCliente.apiUrl + '/disponibilidadTerapeuta';
    private readonly http = inject(HttpClient);

    constructor() { }


    listarTodas(): Observable<TerapeutaDisponibilidad[]> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
        Authorization: `Bearer ${token}`
    };
    return this.http.get<TerapeutaDisponibilidad[]>(`${this._apiUrl}/todos`, { headers });
  }

  obtenerPorEmpleado(empleadoId: number): Observable<TerapeutaDisponibilidad[]> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
        Authorization: `Bearer ${token}`
    };
    return this.http.get<TerapeutaDisponibilidad[]>(`${this._apiUrl}/disponibilidad/${empleadoId}`, { headers });
  }

  obtenerPorId(id: number): Observable<TerapeutaDisponibilidad> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
        Authorization: `Bearer ${token}`
    };
    return this.http.get<TerapeutaDisponibilidad>(`${this._apiUrl}/obtenerId/${id}`, { headers });
  }

  guardarDisponibilidad(disponibilidad: TerapeutaDisponibilidad): Observable<any> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
        Authorization: `Bearer ${token}`
    };
    return this.http.post(`${this._apiUrl}/guardar`, disponibilidad, { headers, responseType: 'text' as 'json' });
  }

  actualizarDisponibilidad(id: number, disponibilidad: TerapeutaDisponibilidad): Observable<any> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
        Authorization: `Bearer ${token}`
    };
    return this.http.put(`${this._apiUrl}/actualizarPorId/${id}`, disponibilidad, { headers });
  }

  eliminarDisponibilidad(id: number): Observable<any> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
        Authorization: `Bearer ${token}`
    };
    return this.http.delete(`${this._apiUrl}/eliminarDisponibilidadId/${id}`, {
  headers: {
    Authorization: `Bearer ${token}`
  },
    responseType: 'text'
    });
  }

  obtenerDisponibilidadPorEmpleado(idEmpleado: number): Observable<TerapeutaDisponibilidad[]> {
  const token = localStorage.getItem('accessToken');
  const headers = {
    Authorization: `Bearer ${token}`
  };
  return this.http.get<TerapeutaDisponibilidad[]>(`${this._apiUrl}/disponibilidad/${idEmpleado}`, { headers });
  }

}