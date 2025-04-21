import { inject, Injectable } from '@angular/core';
import { appsettingsCliente } from '../../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Usuario ,UsuarioRegistro} from '../../Models/Entity/Usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly _apiUrl= appsettingsCliente.apiUrl+"/segurity";
  private readonly http = inject(HttpClient);
  constructor() { }

  // verificacion.service.ts
  enviarCodigo(usuario: UsuarioRegistro): Observable<any> {
    return this.http.post(this._apiUrl+"/enviarCodigo", usuario);
  }

  verificarCodigo(username:string,code:string): Observable<any> {
    const body = { username, code };
    return this.http.post(this._apiUrl+"/validarCodigo", body);
  }

  login (username:string,password:string): Observable<any> {
    const body = { username, password };
    return this.http.post(this._apiUrl+"/log-in", body);
  }


}
