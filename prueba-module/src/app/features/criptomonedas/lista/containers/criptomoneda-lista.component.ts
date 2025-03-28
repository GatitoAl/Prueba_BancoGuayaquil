import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CriptomonedaApiService } from '../../services/criptomoneda-api.service';
import { CriptomonedaStorageService } from '../../services/criptomoneda-storage.service';

@Component({
  selector: 'app-criptomoneda-lista',
  template: `
    <h2>Lista de Criptomonedas</h2>
    <ul>
      <li *ngFor="let crypto of criptomonedasPaginadas">
        {{ crypto.name }} ({{ crypto.symbol }})
      </li>
    </ul>
    <button (click)="paginaAnterior()" [disabled]="pagina === 1">Anterior</button>
    <button (click)="paginaSiguiente()">Siguiente</button>
  `,
  standalone: true,
  imports: [CommonModule] // Asegúrate de incluir CommonModule aquí
})
export class CriptomonedaListaComponent implements OnInit {
  criptomonedas: any[] = [];
  criptomonedasPaginadas: any[] = [];
  pagina = 1;
  elementosPorPagina = 10;

  constructor(
    private apiService: CriptomonedaApiService,
    private storageService: CriptomonedaStorageService
  ) { }

  ngOnInit(): void {
    const datosEnStorage = sessionStorage.getItem('criptomonedas');
    if (datosEnStorage) {
      this.criptomonedas = JSON.parse(datosEnStorage);
      this.actualizarPaginacion();
    } else {
      this.apiService.obtenerCriptomonedas().subscribe(data => {
        this.criptomonedas = data;
        sessionStorage.setItem('criptomonedas', JSON.stringify(data));
        this.actualizarPaginacion();
      });
    }
  }

  actualizarPaginacion(): void {
    const inicio = (this.pagina - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.criptomonedasPaginadas = this.criptomonedas.slice(inicio, fin);
  }

  paginaAnterior(): void {
    if (this.pagina > 1) {
      this.pagina--;
      this.actualizarPaginacion();
    }
  }

  paginaSiguiente(): void {
    if (this.pagina * this.elementosPorPagina < this.criptomonedas.length) {
      this.pagina++;
      this.actualizarPaginacion();
    }
  }
}