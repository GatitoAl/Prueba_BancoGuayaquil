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
  itemsPorPagina: number = 5;
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
    // Nos suscribimos al observable del servicio de almacenamiento
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
        // Guardamos los datos obtenidos en el servicio de almacenamiento
        this.criptomonedaStorageService.guardarTodas(data);
        this.todasCriptomonedas = this.sortCriptomonedas(data);
        this.actualizarPaginacion();
      })
    );
  }

  actualizarPaginacion(): void {
    this.totalPaginas = Math.ceil(this.todasCriptomonedas.length / this.itemsPorPagina);

    // Aseguramos que la página actual es válida
    if (this.paginaActual < 1) this.paginaActual = 1;
    if (this.paginaActual > this.totalPaginas) this.paginaActual = this.totalPaginas;

    // Calculamos el índice inicial y final para la página actual
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = Math.min(inicio + this.itemsPorPagina, this.todasCriptomonedas.length);

    // Obtenemos los elementos para la página actual
    this.criptomonedas = this.todasCriptomonedas.slice(inicio, fin);

    // Generamos el array de páginas
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

  editarCriptomoneda(cripto: Criptomoneda, event: Event): void {
    event.stopPropagation();
    if (cripto.id) {
      this.router.navigate(['/criptomonedas/editar', cripto.id]);
    }
  }

  verDetalleCriptomoneda(cripto: Criptomoneda): void {
    if (cripto.id) {
      this.router.navigate(['/criptomonedas/detalle', cripto.id]);
    }
  }

  sortCriptomonedas(criptomonedas: Criptomoneda[]): Criptomoneda[] {
    return [...criptomonedas].sort((a, b) => {
      // Primero los favoritos
      if (a.favorito && !b.favorito) return -1;
      if (!a.favorito && b.favorito) return 1;

      // Luego por nombre
      return a.nombre.localeCompare(b.nombre);
    });
  }
}