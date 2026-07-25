import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // 1. Motor de navegação importado
import { Meta } from '../services/meta';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent implements OnInit {
  listaDeMetas: any[] = [];
  
  cadastroForm = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    servico: new FormControl('', Validators.required),
    preco: new FormControl('', [Validators.required, Validators.min(1)]),
    linkWhatsapp: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.minLength(10),
      Validators.maxLength(11),
    ]),
  });

  // 2. Injetamos o Router aqui no constructor
  constructor(private metaService: Meta, private router: Router) {}

  ngOnInit() {
    this.metaService.getMetas().subscribe((res: any) => {
      this.listaDeMetas = res;
    });
  }

  onSubmit() {
    console.log("Tentando enviar...", this.cadastroForm.value);
    
    if (this.cadastroForm.valid) {
      // Capturamos o e-mail antes de qualquer coisa para passar para a próxima tela
      const emailDigitado = this.cadastroForm.value.email;

      this.metaService.cadastrarCliente(this.cadastroForm.value).subscribe({
        next: (res) => {
          this.showToast('success', '🚀 Cadastro realizado!', 'Verifique o código no seu e-mail.');

          // 3. REDIRECIONAMENTO: Manda o cara para a tela de verificação
          // Passamos o e-mail via QueryParams para a tela /verify saber quem validar
          setTimeout(() => {
            this.router.navigate(['/verify'], { queryParams: { email: emailDigitado } });
            this.cadastroForm.reset();
          }, 1500);
        },
        error: (err) => {
          console.error(err);
          if (err.status === 400) {
            // Backend retornou erro de validação (email duplicado, etc)
            this.showToast('error', '⚠️ Email já cadastrado', 'Esse e-mail já está em uso. Tente fazer login ou use outro e-mail.');
          } else {
            this.showToast('error', '❌ Erro de conexão', 'Verifique se o backend está rodando (IntelliJ Play).');
          }
        }
      });
    } else {
      this.showToast('error', '⚠️ Formulário inválido', 'Verifique e-mail e WhatsApp (11 dígitos).');
    }
  }

  limparTexto(event: any) {
    const input = event.target;
    // Regex ajustada para aceitar espaços (\s) entre os nomes
    input.value = input.value.replace(/[^a-zA-ZÀ-ÿ\s]/g,''); 
    this.cadastroForm.get(input.getAttribute('formControlName'))?.setValue(input.value);
  }

  excluir(id: number) {
    this.listaDeMetas = this.listaDeMetas.filter((item) => item.id !== id);
    this.metaService.deletar(id).subscribe({
      next: () => console.log('Apagado do banco com sucesso!'),
      error: (erro) => {
        alert('Ops, erro ao excluir no sistema.');
        this.ngOnInit();
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
