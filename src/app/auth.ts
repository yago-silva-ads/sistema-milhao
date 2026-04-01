import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(login: string, password: string) {
    return this.http.post<any>('http://localhost:8080/auth/login', { login, password }).pipe(
      tap(res => {
        // SALVA O TOKEN NO NAVEGADOR
        localStorage.setItem('token_milhao', res.token);
      })
    );
  }
}