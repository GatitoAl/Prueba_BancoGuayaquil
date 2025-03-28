import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CriptomonedaStorageService } from '../../services/criptomoneda-storage.service';
import { Criptomoneda } from '../../models/criptomoneda.model';

@Component({
  selector: 'app-criptomoneda-mantenimiento',
  template: `
    <h2>Mantenimiento de Criptomonedas</h2>
    <form (ngSubmit)="guardar()">
      <input [(ngModel)]="criptomoneda.codigo" placeholder="Código" name="codigo" required />
      <input [(ngModel)]="criptomoneda.nombre" placeholder="Nombre" name="nombre" required />
      <textarea [(ngModel)]="criptomoneda.descripcion" placeholder="Descripción" name="descripcion"></textarea>
      <select [(ngModel)]="criptomoneda.estado" name="estado" required>
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>
      <button type="submit">Guardar</button>
    </form>
    <ul>
      <li *ngFor="let crypto of criptomonedas">
        {{ crypto.nombre }} ({{ crypto.codigo }})
        <button (click)="editar(crypto)">Editar</button>
        <button (click)="eliminar(crypto.id)">Eliminar</button>
      </li>
    </ul>
  `,
  standalone: true,
  imports: [FormsModule] // Asegúrate de incluir FormsModule aquí
})
export class CriptomonedaMantenimientoComponent {
  criptomonedas: Criptomoneda[] = [];
  criptomoneda: Criptomoneda = { codigo: '', nombre: '', estado: 'Activo' };

  constructor(private storageService: CriptomonedaStorageService) {
    this.storageService.obtenerTodas().subscribe(data => {
      this.criptomonedas = data;
    });
  }

  guardar(): void {
    this.storageService.guardar(this.criptomoneda);
    this.criptomoneda = { codigo: '', nombre: '', estado: 'Activo' };
  }

  editar(crypto: Criptomoneda): void {
    this.criptomoneda = { ...crypto };
  }

  eliminar(id: string): void {
    this.storageService.eliminar(id);
  }
}