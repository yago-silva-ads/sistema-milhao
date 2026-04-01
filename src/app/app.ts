import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], 
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  // Esse arquivo agora é só o palco principal.
  // O router-outlet no app.html vai decidir qual tela entra aqui!
}