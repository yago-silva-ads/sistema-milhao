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

        alert('🏆 BRABO! Seu acesso foi liberado.');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        alert('❌ Código incorreto!');
      },
    });
  }
}
