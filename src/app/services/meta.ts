import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Meta {
  private readonly API_PROFISSIONAIS = `${environment.apiUrl}/profissionais`;

  constructor(private http: HttpClient) {}

  getMetas(): Observable<any[]> {
    return this.http.get<any[]>(this.API_PROFISSIONAIS);
  }

  cadastrarCliente(dados: any): Observable<any> {
    return this.http.post(`${this.API_PROFISSIONAIS}/cadastrar`, dados);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.API_PROFISSIONAIS}/${id}`);
  }

  verificarCodigo(email: string, codigo: string): Observable<any> {
    return this.http.post(`${this.API_PROFISSIONAIS}/verificar`, {
      email,
      codigo,
    });
  }
}
