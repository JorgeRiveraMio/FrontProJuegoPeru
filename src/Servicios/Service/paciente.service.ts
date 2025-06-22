import { inject, Injectable } from "@angular/core";
import { appsettingsCliente } from "../../Ajustes/app.settings";
import { HttpClient } from "@angular/common/http";
import { Paciente, PacienteRegistro } from "../../Modelos/Entity/Paciente";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class PacienteService {

  private readonly _apiUrl = appsettingsCliente.apiUrl + '/paciente';
  private readonly http = inject(HttpClient);
  
  constructor() { }

  registrarPaciente(paciente: PacienteRegistro) {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.post<Paciente>(this._apiUrl + "/guardar",paciente, { headers });
  }

  obtenerPacientesPorTutor(tutorId: number): Observable<Paciente[]> {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No se encontró token de autenticación.');
  }

  // Asegúrate de que la URL esté bien formada, con interpolación de tutorId
  const headers = {
    Authorization: `Bearer ${token}`
  };

  // Forma correcta de construir la URL
  const url = `${this._apiUrl}/tutor/${tutorId}`; // Usamos interpolación de strings

  return this.http.get<Paciente[]>(url, { headers });
  }

  actualizarPaciente(dni: string, pacienteDetalles: Paciente): Observable<Paciente> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No se encontró token de autenticación.');
    }
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.put<Paciente>(`${this._apiUrl}/actualizar/${dni}`, pacienteDetalles, { headers });
  }
}
