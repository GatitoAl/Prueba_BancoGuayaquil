import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Criptomoneda } from '../../models/criptomoneda.model';
import { CriptomonedaStorageService } from '../../services/criptomoneda-storage.service';

@Component({
  selector: 'app-criptomoneda-mantenimiento',
  templateUrl: './criptomoneda-mantenimiento.component.html',
  styleUrls: ['./criptomoneda-mantenimiento.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CriptomonedaMantenimientoComponent implements OnInit, OnDestroy {
  criptomonedaForm: FormGroup;
  isEditMode = false;
  submitted = false;
  loading = false;
  successMessage = '';
  errorMessage = '';

  private subscription = new Subscription();

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
    this.subscription.add(
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.loadCriptomoneda(id);
        } else {
          this.isEditMode = false;
          this.resetForm();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadCriptomoneda(id: string): void {
    this.loading = true;

    this.subscription.add(
      this.criptomonedaStorageService.obtenerTodas().subscribe({
        next: (criptomonedas) => {
          const criptomoneda = criptomonedas.find(c => c.id === id);
          if (criptomoneda) {
            this.criptomonedaForm.patchValue(criptomoneda);
            this.isEditMode = true;
          } else {
            setTimeout(() => this.router.navigate(['/criptomonedas']), 2000);
          }
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al cargar la criptomoneda';
          this.loading = false;
        }
      })
    );
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
      if (!this.isEditMode && !criptomoneda.id) {
        criptomoneda.id = Date.now().toString();
      }

      this.criptomonedaStorageService.guardar(criptomoneda);
      this.successMessage = `Criptomoneda ${this.isEditMode ? 'actualizada' : 'creada'} correctamente`;

      // Regresamos a la ruta de listas
      setTimeout(() => {
        this.router.navigate(['/criptomonedas']);
      }, 1500);
    } catch (error) {
      this.errorMessage = `Error al ${this.isEditMode ? 'actualizar' : 'crear'} la criptomoneda`;
      this.loading = false;
    }
  }

  eliminarCriptomoneda(): void {
    const id = this.criptomonedaForm.get('id')?.value;
    if (id && confirm('¿Está seguro de eliminar esta criptomoneda?')) {
      this.loading = true;
      try {
        this.criptomonedaStorageService.eliminar(id);
        this.successMessage = 'Criptomoneda eliminada correctamente';
        setTimeout(() => {
          this.router.navigate(['/criptomonedas']);
        }, 1500);
      } catch (error) {
        this.errorMessage = 'Error al eliminar la criptomoneda';
        this.loading = false;
      }
    }
  }

  toggleFavorito(): void {
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

  resetForm(): void {
    this.criptomonedaForm.reset({
      id: '',
      codigo: '',
      nombre: '',
      descripcion: '',
      estado: 'Activo',
      favorito: false
    });
    this.submitted = false;
  }

  // Getters para facilitar el acceso a los campos del formulario
  get f() { return this.criptomonedaForm.controls; }
}