import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta } from '../services/meta';
import { Router } from '@angular/router';
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

  statusPagamento: string = 'ATIVO';
  nomeUsuario: string = '...';

  constructor(
    private metaService: Meta,
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
        // Procura você no banco
        const eu = profissionais.find((p) => p.email === email);

        if (eu) {
          this.statusPagamento = eu.statusPagamento;
          this.nomeUsuario = eu.nome;

          // --- LÓGICA DE ANÁLISE DE DADOS ---
          // Pegamos o preço que você cadastrou no banco (ex: R$ 25,00)
          const precoBase = eu.preco || 0;

          // Simulamos 30 serviços no mês para o MVP
          const qtdServicos = 30;

          this.faturamentoMensal = precoBase * qtdServicos;
          this.ticketMedio = precoBase;

          // Lucro Real: Faturamento menos 30% de custos (lâminas, energia, aluguel)
          const taxaCusto = 0.3;
          this.lucroEstimado = this.faturamentoMensal * (1 - taxaCusto);

          // Dispara o gráfico se estiver ativo
          if (this.statusPagamento === 'ATIVO') {
            setTimeout(() => this.renderizarGrafico(), 150);
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

    this.chartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        datasets: [
          {
            label: 'Faturamento R$',
            data: [1200, 1900, 1500, 2200, 1800, 2500, 2100], // Dados fixos para o PICTA
            backgroundColor: '#00ff88', // Verde Neon do Sistema Milhão
            borderRadius: 8,
            hoverBackgroundColor: '#00cc6a',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#30363d' },
            ticks: { color: '#8b949e' },
          },
          x: {
            grid: { display: false },
            ticks: { color: '#8b949e' },
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
        alert('📋 Link copiado com sucesso! Agora é só mandar pros clientes.');
      })
      .catch((err) => {
        console.error('Erro ao copiar link:', err);
      });
  }
}
