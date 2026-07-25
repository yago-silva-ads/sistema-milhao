import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-esqueci-senha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './esqueci-senha.html',
  styleUrls: ['./esqueci-senha.css']
})
export class EsqueciSenhaComponent {
  step: 'email' | 'codigo' | 'nova-senha' = 'email';
  email = '';
  codigo = '';
  novaSenha = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  enviarCodigo() {
    this.loading = true;
    this.http.post<any>(`${environment.apiUrl}/profissionais/esqueci-senha`, { email: this.email }).subscribe({
      next: () => {
        this.step = 'codigo';
        this.loading = false;
        this.showToast('success', '📧 Código enviado!', 'Verifique seu e-mail.');
      },
      error: () => {
        this.step = 'codigo'; // Não revelamos se email existe
        this.loading = false;
      }
    });
  }

  validarCodigo() {
    this.step = 'nova-senha';
  }

  resetarSenha() {
    this.loading = true;
    this.http.post<any>(`${environment.apiUrl}/profissionais/resetar-senha`, {
      email: this.email,
      codigo: this.codigo,
      novaSenha: this.novaSenha
    }).subscribe({
      next: () => {
        this.showToast('success', '✅ Senha atualizada!', 'Faça login com sua nova senha.');
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: () => {
        this.showToast('error', '❌ Erro', 'Código inválido ou expirado.');
        this.loading = false;
      }
    });
  }

  private showToast(type: 'success' | 'error', title: string, subtitle: string) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : '✗'}</span>
      <div class="toast-message">
        <div class="toast-title">${title}</div>
        <div class="toast-subtitle">${subtitle}</div>
      </div>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }
}
