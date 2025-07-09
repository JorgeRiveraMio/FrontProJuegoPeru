import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { appsettingsCliente } from '../../Ajustes/app.settings';


@Injectable({
  providedIn: 'root'
})
export class InformeEvaluacionService {

  private baseUrl = `${appsettingsCliente.apiUrl}/InformeEvaluacionInicial`;

  constructor(private http: HttpClient) {}

  guardarInforme(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/guardar`, formData);
  }

  verInformePdf(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/ver/${id}`, { responseType: 'blob' });
  }

  obtenerTodos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/todos`);
  }

  obtenerPorPaciente(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/paciente/${id}`);
  }

  aprobarInforme(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/aprobarId/${id}`, null);
  }

  desaprobarInforme(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/desaprobarId/${id}`, null);
  }

  actualizarComentario(id: number, comentario: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/actualizarComentario/${id}`,
      comentario,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}
