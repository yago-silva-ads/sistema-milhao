import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Adicionei o ChangeDetectorRef
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // OBRIGATÓRIO
import { Meta } from '../services/meta';

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [CommonModule], // GARANTA QUE ISSO ESTÁ AQUI
  templateUrl: './public-profile.html',
  styleUrls: ['./public-profile.css']
})
export class PublicProfileComponent implements OnInit {
  profissional: any = null;
  nomeUrl: string = '';

  constructor(
    private route: ActivatedRoute, 
    private metaService: Meta,
    private cdr: ChangeDetectorRef // Dica de mestre para forçar a atualização
  ) {}

  ngOnInit() {
    this.nomeUrl = this.route.snapshot.paramMap.get('nome') || '';
    if (this.nomeUrl) {
      this.carregarProfissional(this.nomeUrl);
    }
  }

  carregarProfissional(nome: string) {
    this.metaService.getMetas().subscribe({
      next: (profissionais) => {
        const match = profissionais.find(p => 
          p.nome.trim().toLowerCase() === nome.trim().toLowerCase()
        );

        if (match) {
          console.log('✅ João encontrado! Atualizando tela...');
          this.profissional = match;
          this.cdr.detectChanges(); // Força o Angular a "olhar" pra tela
        } else {
          console.error('❌ Profissional não encontrado');
        }
      },
      error: (err) => console.error('Erro na API:', err)
    });
  }

  irParaWhatsApp() {
    if (this.profissional) {
      const num = this.profissional.link_whatsapp || '11984370338';
      const msg = encodeURIComponent(`Olá ${this.profissional.nome}, vi seu perfil no Sistema Milhão!`);
      window.open(`https://wa.me/55${num}?text=${msg}`, '_blank');
    }
  }
}