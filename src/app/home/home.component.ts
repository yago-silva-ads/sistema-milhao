import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Necessário para os botões funcionarem

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent { }