import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta } from '../services/meta';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify.html',
  styleUrls: ['./verify.css'],
})
export class VerifyComponent implements OnInit {
  email: string = '';
  codigoInput: string = '';

  constructor(
    private route: ActivatedRoute,
    private metaService: Meta,
    private router: Router,
  ) {}

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
  }

  validarAcesso() {
    console.log('Validando para o e-mail:', this.email);

    this.metaService.verificarCodigo(this.email, this.codigoInput).subscribe({
      next: (res) => {
        localStorage.setItem('user_email', this.email);
        this.showToast('success', '🏆 BRABO!', 'Seu acesso foi liberado. Redirecionando...');
        
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (err) => {
        this.showToast('error', '❌ Código incorreto', 'Verifique o código enviado no seu e-mail.');
      },
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
