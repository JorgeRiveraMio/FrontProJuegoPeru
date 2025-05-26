import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appsettingsCliente } from '../../Ajustes/app.settings';
import { Usuario, UsuarioRegistro } from '../../Modelos/Entity/Usuario';
import { UsuarioActual } from '../../Modelos/Entity/UsuarioActual';
import { AuthResponse } from '../../Modelos/auth-response';
import { EmpleadoRegistro } from '../../Modelos/Entity/Empleado';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly _apiUrl = appsettingsCliente.apiUrl + '/security';
  private readonly http = inject(HttpClient);

  constructor() { }

  enviarCodigo(usuario: UsuarioRegistro): Observable<any> {
    return this.http.post(this._apiUrl + "/enviarCodigo", usuario);
  }

  verificarCodigo(username: string, code: string): Observable<any> {
    const body = { username, code };
    return this.http.post(this._apiUrl + "/validarCodigo", body);
  }

  obtenerUsuarioActual(): Observable<UsuarioActual> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.get<UsuarioActual>(this._apiUrl + "/actual-usuario", { headers });
  }

  completarPerfil(tutor: UsuarioRegistro): Observable<any> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.put(this._apiUrl + "/completarPerfil", tutor, { headers });
  }

  // Login
  login(username: string, password: string): Observable<AuthResponse> {
    const body = { username, password };
    return this.http.post<AuthResponse>(this._apiUrl + "/log-in", body);
  }

  forgotPassword(username: string): Observable<any> {
    return this.http.post(this._apiUrl + "/forgot-password?username=" + encodeURIComponent(username), {});
  }

  resetPassword(token: string, nuevaContrasena: string): Observable<any> {
    const params = `?token=${encodeURIComponent(token)}&nuevaContrasena=${encodeURIComponent(nuevaContrasena)}`;
    return this.http.post(this._apiUrl + "/reset-password" + params, {});
  }
  
  logout(): void {
    localStorage.removeItem('accessToken');
  }
  
  //Empleado
  actualizarEmpleado(id: number, empleadoData: EmpleadoRegistro): Observable<any> {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No se encontró token de autenticación.');
  }
  const headers = {
    Authorization: `Bearer ${token}`
  };
  return this.http.put(`${appsettingsCliente.apiUrl}/empleado/actualizarPorId/${id}`, empleadoData, { headers });
  }

  //Listar terapeutas
  ListarTerapeutas(): Observable<UsuarioActual[]> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.get<UsuarioActual[]>(`${appsettingsCliente.apiUrl}/empleado/todosTerapeuta`, { headers });
  }
}
