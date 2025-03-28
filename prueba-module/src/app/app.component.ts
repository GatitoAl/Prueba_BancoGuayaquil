import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule, // Importa el módulo de Angular Material para la barra de herramientas
    RouterModule      // Importa el módulo de enrutamiento si estás usando rutas
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Prueba Banco Guayaquil';
}