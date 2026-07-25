import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(login: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { login, password }).pipe(
      tap(res => {
        localStorage.setItem('token_milhao', res.token);
      })
    );
  }
}
