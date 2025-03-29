import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Criptomoneda } from '../../models/criptomoneda.model';
import { CriptomonedaStorageService } from '../../services/criptomoneda-storage.service';

@Component({
  selector: 'app-criptomoneda-mantenimiento',
  templateUrl: './criptomoneda-mantenimiento.component.html',
  styleUrls: ['./criptomoneda-mantenimiento.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CriptomonedaMantenimientoComponent implements OnInit {
  criptomonedaForm: FormGroup;
  isEditMode = false;
  submitted = false;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private criptomonedaStorageService: CriptomonedaStorageService
  ) {
    this.criptomonedaForm = this.fb.group({
      id: [''],
      codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: [''],
      estado: ['Activo', Validators.required],
      favorito: [false]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCriptomoneda(id);
    }
  }

  loadCriptomoneda(id: string): void {
    this.loading = true;

    this.criptomonedaStorageService.obtenerTodas().subscribe({
      next: (criptomonedas) => {
        const criptomoneda = criptomonedas.find(c => c.id === id);
        if (criptomoneda) {
          this.criptomonedaForm.patchValue(criptomoneda);
          this.isEditMode = true;
        } else {
          this.errorMessage = 'No se encontró la criptomoneda solicitada';
          setTimeout(() => this.router.navigate(['/criptomonedas']), 2000);
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar la criptomoneda';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Detener si el formulario es inválido
    if (this.criptomonedaForm.invalid) {
      return;
    }

    this.loading = true;
    const criptomoneda: Criptomoneda = this.criptomonedaForm.value;

    try {
      this.criptomonedaStorageService.guardar(criptomoneda);
      this.successMessage = `Criptomoneda ${this.isEditMode ? 'actualizada' : 'creada'} correctamente`;

      // Resetear el formulario si es una creación
      if (!this.isEditMode) {
        this.criptomonedaForm.reset({
          estado: 'Activo',
          favorito: false
        });
        this.submitted = false;
      }

      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    } catch (error) {
      this.errorMessage = `Error al ${this.isEditMode ? 'actualizar' : 'crear'} la criptomoneda`;
    } finally {
      this.loading = false;
    }
  }

  toggleFavorite(): void {
    const currentValue = this.criptomonedaForm.get('favorito')?.value;
    this.criptomonedaForm.get('favorito')?.setValue(!currentValue);
  }

  toggleEstado(): void {
    const currentValue = this.criptomonedaForm.get('estado')?.value;
    const newValue = currentValue === 'Activo' ? 'Inactivo' : 'Activo';
    this.criptomonedaForm.get('estado')?.setValue(newValue);
  }

  cancelar(): void {
    this.router.navigate(['/criptomonedas']);
  }

  // Getters para facilitar el acceso a los campos del formulario en la plantilla
  get f() { return this.criptomonedaForm.controls; }
}