import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Criptomoneda } from '../../models/criptomoneda.model';
import { CriptomonedaStorageService } from '../../services/criptomoneda-storage.service';
import { CriptomonedaApiService } from '../../services/criptomoneda-api.service';

@Component({
  selector: 'app-criptomoneda-lista',
  templateUrl: './criptomoneda-lisa.component.html',
  styleUrls: ['./criptomoneda-lisa.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CriptomonedaListaComponent implements OnInit, OnDestroy {
  // Datos completos y paginados
  todasCriptomonedas: Criptomoneda[] = [];
  criptomonedas: Criptomoneda[] = [];

  // Configuración de paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  totalPaginas: number = 1;
  paginas: number[] = [];

  private subscription = new Subscription();

  constructor(
    private router: Router,
    private criptomonedaStorageService: CriptomonedaStorageService,
    private criptomonedaApiService: CriptomonedaApiService
  ) { }

  ngOnInit(): void {
    this.cargarCriptomonedas();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cargarCriptomonedas(): void {
    // Nos suscribimos al servicio de almacenamiento
    this.subscription.add(
      this.criptomonedaStorageService.obtenerTodas().subscribe(criptomonedas => {
        if (criptomonedas.length === 0) {
          // Si no hay datos en sessionStorage, cargamos desde la API
          this.cargarDesdeAPI();
        } else {
          this.todasCriptomonedas = this.sortCriptomonedas(criptomonedas);
          this.actualizarPaginacion();
        }
      })
    );
  }

  cargarDesdeAPI(): void {
    this.subscription.add(
      this.criptomonedaApiService.obtenerCriptomonedas().subscribe((data: Criptomoneda[]) => {
        const criptosConFavoritos = data.map(cripto => ({
          ...cripto,
          favorito: cripto.favorito !== undefined ? cripto.favorito : false
        }));

        // Guardamos los datos
        this.criptomonedaStorageService.guardarTodas(criptosConFavoritos);
        this.todasCriptomonedas = this.sortCriptomonedas(criptosConFavoritos);
        this.actualizarPaginacion();
      })
    );
  }


  actualizarPaginacion(): void {
    this.totalPaginas = Math.ceil(this.todasCriptomonedas.length / this.itemsPorPagina);
    if (this.paginaActual < 1) this.paginaActual = 1;
    if (this.paginaActual > this.totalPaginas) this.paginaActual = this.totalPaginas;
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = Math.min(inicio + this.itemsPorPagina, this.todasCriptomonedas.length);
    this.criptomonedas = this.todasCriptomonedas.slice(inicio, fin);
    this.paginas = [];
    for (let i = 1; i <= this.totalPaginas; i++) {
      this.paginas.push(i);
    }
  }

  irAPagina(pagina: number): void {
    this.paginaActual = pagina;
    this.actualizarPaginacion();
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPaginacion();
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPaginacion();
    }
  }

  toggleFavorito(cripto: Criptomoneda, event: Event): void {
    event.stopPropagation();
    if (cripto.id) {
      this.criptomonedaStorageService.toggleFavorito(cripto.id);
    }
  }

  verDetalleCriptomoneda(cripto: Criptomoneda): void {
    // Dirigimos a la ruta de mantenimiento
    if (cripto.id) {
      this.router.navigate(['/criptomonedas/mantenimiento', cripto.id]);
    }
  }

  //Función para organizar a los favoritos primero
  sortCriptomonedas(criptomonedas: Criptomoneda[]): Criptomoneda[] {
    return [...criptomonedas].sort((a, b) => {
      if (a.favorito && !b.favorito) return -1;
      if (!a.favorito && b.favorito) return 1;
      return a.nombre.localeCompare(b.nombre);
    });
  }
}