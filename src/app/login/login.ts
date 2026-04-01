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
        alert('🔥 Login efetuado com sucesso!');
        
       
       
        this.router.navigate(['/dashboard'], { queryParams: { email: this.dadosLogin.login } });
      },
      error: (erro) => {
        console.error("❌ Erro no login:", erro);
        alert('Login ou senha incorretos! Tente novamente.');
      }
    });
  }
}





















