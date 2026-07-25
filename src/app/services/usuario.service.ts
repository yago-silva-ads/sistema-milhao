import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ============================================================
// SISTEMA MILHÃO — UsuarioService
// Consome a API REST Java: http://localhost:8080/api/v1/usuarios
// ============================================================

/**
 * Interface que espelha o UsuarioResponse do backend Java.
 */
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  nivelAcesso: string;
  criadoEm: string;
  atualizadoEm: string;
}

/**
 * Interface que espelha o UsuarioRequest do backend Java.
 */
export interface UsuarioRequest {
  nome: string;
  email: string;
  nivelAcesso: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly BASE_URL = 'http://localhost:8080/api/v1/usuarios';

  constructor(private http: HttpClient) {}

  // ---------- GET ----------

  /**
   * Lista todos os usuários cadastrados.
   * GET /api/v1/usuarios
   */
  listarTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.BASE_URL);
  }

  /**
   * Busca um usuário específico pelo ID.
   * GET /api/v1/usuarios/{id}
   */
  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.BASE_URL}/${id}`);
  }

  /**
   * Busca usuários pelo nome (parcial, case-insensitive).
   * GET /api/v1/usuarios/buscar?nome=...
   */
  buscarPorNome(nome: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.BASE_URL}/buscar`, {
      params: { nome },
    });
  }

  /**
   * Filtra usuários por nível de acesso.
   * GET /api/v1/usuarios/nivel/{nivelAcesso}
   */
  buscarPorNivel(nivelAcesso: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.BASE_URL}/nivel/${nivelAcesso}`);
  }

  // ---------- POST ----------

  /**
   * Cadastra um novo usuário.
   * POST /api/v1/usuarios
   */
  cadastrar(usuario: UsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.BASE_URL, usuario);
  }

  // ---------- PUT ----------

  /**
   * Atualiza os dados de um usuário existente.
   * PUT /api/v1/usuarios/{id}
   */
  atualizar(id: number, usuario: UsuarioRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.BASE_URL}/${id}`, usuario);
  }

  // ---------- DELETE ----------

  /**
   * Remove um usuário do sistema.
   * DELETE /api/v1/usuarios/{id}
   */
  deletar(id: number): Observable<{ mensagem: string; id: string }> {
    return this.http.delete<{ mensagem: string; id: string }>(
      `${this.BASE_URL}/${id}`
    );
  }
}
