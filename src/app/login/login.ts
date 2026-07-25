import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})

export class LoginComponent {

  dadosLogin = { login: '', senha: '' };

  constructor(private authService: AuthService, private router: Router) {}

  entrar() {
    console.log("🚀 Iniciando login para:", this.dadosLogin.login);

    this.authService.login(this.dadosLogin.login, this.dadosLogin.senha).subscribe({
      next: (resposta: any) => {
        localStorage.setItem('user_email', this.dadosLogin.login);
        this.showToast('success', '🔥 Login efetuado!', 'Entrando no sistema...');
        this.showLoading();

        setTimeout(() => {
          this.router.navigate(['/dashboard'], { queryParams: { email: this.dadosLogin.login } });
        }, 2200);
      },
      error: (erro) => {
        console.error("❌ Erro no login:", erro);
        this.showToast('error', '❌ Erro no login', 'Email ou senha incorretos. Tente novamente.');
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

  private showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.style.display = 'flex';
    }
  }
}





















