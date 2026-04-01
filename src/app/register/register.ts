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
          alert('🚀 Cadastro realizado com sucesso! Verifique seu código no e-mail.');
          
          // 3. REDIRECIONAMENTO: Manda o cara para a tela de verificação
          // Passamos o e-mail via QueryParams para a tela /verify saber quem validar
          this.router.navigate(['/verify'], { queryParams: { email: emailDigitado } });
          
          this.cadastroForm.reset(); 
        },
        error: (err) => {
          console.error(err);
          alert('❌ Erro de conexão com o Java! Verifique se o IntelliJ está com o Play ligado.');
        }
      });
    } else {
      alert('⚠️ Formulário Inválido! Verifique se o e-mail está certo e o WhatsApp tem 11 dígitos.');
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
}