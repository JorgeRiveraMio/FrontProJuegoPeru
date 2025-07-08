import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InformeEvaluacionService {

  private baseUrl = 'http://localhost:8080/InformeEvaluacionInicial'; 

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
      const url = `${this.baseUrl}/aprobarId/${id}`;
      return this.http.put(url, null); // null indica sin body
    }

     desaprobarInforme(id: number): Observable<any> {
      const url = `${this.baseUrl}/desaprobarId/${id}`;
      return this.http.put(url, null); // null indica sin body
    }


}
