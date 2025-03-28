import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Criptomoneda, CriptomonedaAPI } from '../../models/criptomoneda.model';

@Component({
  selector: 'app-criptomoneda-lista',
  templateUrl: './criptomoneda-lisa.component.html',
  styleUrls: ['./criptomoneda-lisa.component.scss']
})
export class CriptomonedaListaComponent implements OnInit {
  criptomonedas: Criptomoneda[] = [];
  private apiUrl = 'https://api.coingecko.com/api/v3/coins/list'; // Reemplaza por tu URL real

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.cargarCriptomonedas();
  }

  cargarCriptomonedas(): void {
    // Primero intentamos recuperar del sessionStorage
    const criptosString = sessionStorage.getItem('criptomonedas');

    if (criptosString) {
      console.log('Datos encontrados en sessionStorage');
      try {
        this.criptomonedas = JSON.parse(criptosString);
        this.sortCriptomonedas();
      } catch (error) {
        console.error('Error al parsear los datos de sessionStorage', error);
        this.cargarDesdeLaAPI();
      }
    } else {
      console.log('No hay datos en sessionStorage, cargando desde API');
      this.cargarDesdeLaAPI();
    }
  }

  cargarDesdeLaAPI(): void {
    this.http.get<CriptomonedaAPI[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log('Datos recibidos de la API:', data);

        // Transformamos los datos de la API al formato de nuestra aplicación
        const criptosTransformadas = data.slice(0, 50).map(item => ({
          id: item.id,
          codigo: item.symbol,
          nombre: item.name,
          descripcion: `Criptomoneda basada en ${item.name}`,
          estado: 'Activo' as 'Activo' | 'Inactivo',
          favorito: false
        }));

        // Guardamos en sessionStorage
        sessionStorage.setItem('criptomonedas', JSON.stringify(criptosTransformadas));

        // Actualizamos la lista
        this.criptomonedas = criptosTransformadas;
        this.sortCriptomonedas();
      },
      error: (error) => {
        console.error('Error al cargar datos desde la API', error);
      }
    });
  }

  guardarCriptomonedas(): void {
    sessionStorage.setItem('criptomonedas', JSON.stringify(this.criptomonedas));
  }

  toggleFavorito(cripto: Criptomoneda, event: Event): void {
    event.stopPropagation();
    cripto.favorito = !cripto.favorito;
    this.guardarCriptomonedas();
    this.sortCriptomonedas();
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

  sortCriptomonedas(): void {
    this.criptomonedas.sort((a, b) => {
      // Primero los favoritos
      if (a.favorito && !b.favorito) return -1;
      if (!a.favorito && b.favorito) return 1;

      // Luego por nombre
      return a.nombre.localeCompare(b.nombre);
    });
  }

  // Función para depuración - puedes añadirla temporalmente
  limpiarStorage(): void {
    sessionStorage.removeItem('criptomonedas');
    console.log('Storage limpiado');
    this.cargarDesdeLaAPI();
  }
}