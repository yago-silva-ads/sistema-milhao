import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta } from '../services/meta';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  faturamentoMensal: number = 0;
  ticketMedio: number = 0;
  lucroEstimado: number = 0;
  private chartInstance: Chart | undefined;

  statusPagamento: string = 'PENDENTE';
  nomeUsuario: string = '...';

  constructor(
    private metaService: Meta,
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit() {
    const emailLogado = localStorage.getItem('user_email');

    if (emailLogado) {
      this.carregarDadosDoPerfil(emailLogado);
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngAfterViewInit() {
    if (this.statusPagamento === 'ATIVO') {
      this.renderizarGrafico();
    }
  }

  carregarDadosDoPerfil(email: string) {
    this.metaService.getMetas().subscribe({
      next: (profissionais) => {
        const eu = profissionais.find((p) => p.email === email);

        if (eu) {
          this.statusPagamento = eu.statusPagamento;
          this.nomeUsuario = eu.nome;

          const precoBase = eu.preco || 0;
          const qtdServicos = 30;

          this.faturamentoMensal = precoBase * qtdServicos;
          this.ticketMedio = precoBase;

          const taxaCusto = 0.3;
          this.lucroEstimado = this.faturamentoMensal * (1 - taxaCusto);

          if (this.statusPagamento === 'ATIVO') {
            setTimeout(() => this.renderizarGrafico(), 200);
          }
        }
      },
      error: (err) => console.error('Erro ao buscar dados:', err),
    });
  }

  renderizarGrafico() {
    const canvas = document.getElementById('meuGrafico') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Gradiente verde premium
    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(0, 255, 135, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 255, 135, 0.1)');

    this.chartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        datasets: [
          {
            label: 'Faturamento R$',
            data: [1200, 1900, 1500, 2200, 1800, 2500, 2100],
            backgroundColor: gradient,
            borderRadius: 8,
            borderSkipped: false,
            hoverBackgroundColor: '#00FF87',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10,10,15,0.95)',
            borderColor: 'rgba(0,255,135,0.3)',
            borderWidth: 1,
            titleColor: '#fff',
            bodyColor: '#00FF87',
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: (ctx: any) => `R$ ${ctx.raw.toLocaleString('pt-BR')}`,
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 11 } },
            border: { display: false },
          },
          x: {
            grid: { display: false },
            ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 12 } },
            border: { display: false },
          },
        },
      },
    });
  }

  logout() {
    localStorage.removeItem('user_email');
    this.router.navigate(['/login']);
  }

  copiarLink() {
    const nomeFormatado = this.nomeUsuario.split(' ').join('').toLowerCase();
    const link = `sistemamilhao.com/perfil/${nomeFormatado}`;

    navigator.clipboard
      .writeText(link)
      .then(() => {
        this.showToast('success', '📋 Link copiado!', 'Agora é só mandar pros clientes.');
      })
      .catch((err) => {
        console.error('Erro ao copiar link:', err);
        this.showToast('error', '❌ Erro', 'Não foi possível copiar o link.');
      });
  }

  ativarPlano() {
    const email = localStorage.getItem('user_email');
    if (!email) return;

    this.showToast('success', '⏳ Redirecionando...', 'Aguarde, estamos preparando o checkout.');

    this.http.post<any>(`${environment.apiUrl}/pagamento/criar-assinatura`, {
      email: email,
      nome: this.nomeUsuario
    }).subscribe({
      next: (res) => {
        // Redireciona para o checkout do Mercado Pago
        window.location.href = res.init_point;
      },
      error: (err) => {
        console.error('Erro ao criar pagamento:', err);
        this.showToast('error', '❌ Erro', 'Não foi possível iniciar o pagamento. Verifique se o backend está rodando.');
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
