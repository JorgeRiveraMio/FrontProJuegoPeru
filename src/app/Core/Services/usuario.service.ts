import { inject, Injectable } from '@angular/core';
import { appsettingsCliente } from '../../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Usuario, UsuarioRegistro } from '../../Models/Entity/Usuario';
import {Empleado, EmpleadoRegistro} from '../../Models/Entity/Empleado'
import { AuthResponse } from '../../Models/auth-response';
import { Observable } from 'rxjs';

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

    // Enviar código para empleado
  enviarCodigoEmpleado(empleado: EmpleadoRegistro): Observable<any> {
    return this.http.post(this._apiUrl + "/enviarCodigoEmpleado", empleado);
  }

  // Verificar código para empleado
  verificarCodigoEmpleado(username: string, code: string): Observable<any> {
    const body = { username, code };
    return this.http.post(this._apiUrl + "/validarCodigoEmpleado", body);
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
  
}
