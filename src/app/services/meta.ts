import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Meta {
  private readonly API = 'http://localhost:8080/profissionais';
  constructor(private http: HttpClient) {}

  getMetas(): Observable<any[]> {
    return this.http.get<any[]>(this.API);
  }
  cadastrarCliente(dados: any): Observable<any> {
    return this.http.post(`${this.API}/cadastrar`, dados);
  }
  deletar(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }
  verificarCodigo(email: string, codigo: string) {
    // O Java espera um objeto (Map) com essas duas chaves exatas!
    const corpoDaRequisicao = {
      email: email,
      codigo: codigo,
    };

    return this.http.post('http://localhost:8080/profissionais/verificar', corpoDaRequisicao);
  }
}
