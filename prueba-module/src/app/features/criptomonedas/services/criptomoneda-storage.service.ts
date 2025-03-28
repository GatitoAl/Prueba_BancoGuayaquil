import { Injectable } from '@angular/core';
import { Criptomoneda } from '../models/criptomoneda.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CriptomonedaStorageService {
    private storageKey = 'criptomonedas';
    private criptomonedasSubject = new BehaviorSubject<Criptomoneda[]>([]);

    constructor() {
        this.cargarDesdeStorage();
    }

    private cargarDesdeStorage(): void {
        const data = sessionStorage.getItem(this.storageKey);
        const criptomonedas = data ? JSON.parse(data) : [];
        this.criptomonedasSubject.next(criptomonedas);
    }

    private guardarEnStorage(criptomonedas: Criptomoneda[]): void {
        sessionStorage.setItem(this.storageKey, JSON.stringify(criptomonedas));
        this.criptomonedasSubject.next(criptomonedas);
    }

    obtenerTodas(): Observable<Criptomoneda[]> {
        return this.criptomonedasSubject.asObservable();
    }

    guardar(criptomoneda: Criptomoneda): void {
        const criptomonedas = [...this.criptomonedasSubject.value];
        if (!criptomoneda.id) {
            criptomoneda.id = Date.now().toString();
            criptomonedas.push(criptomoneda);
        } else {
            const index = criptomonedas.findIndex(c => c.id === criptomoneda.id);
            if (index !== -1) {
                criptomonedas[index] = criptomoneda;
            }
        }
        this.guardarEnStorage(criptomonedas);
    }

    eliminar(id: string): void {
        const criptomonedas = this.criptomonedasSubject.value.filter(c => c.id !== id);
        this.guardarEnStorage(criptomonedas);
    }

    // Nuevos métodos para la funcionalidad de favoritos
    toggleFavorito(id: string): void {
        const criptomonedas = [...this.criptomonedasSubject.value];
        const index = criptomonedas.findIndex(c => c.id === id);

        if (index !== -1) {
            criptomonedas[index] = {
                ...criptomonedas[index],
                favorito: !criptomonedas[index].favorito
            };
            this.guardarEnStorage(criptomonedas);
        }
    }

    // Método para cambiar el estado de una criptomoneda
    toggleEstado(id: string): void {
        const criptomonedas = [...this.criptomonedasSubject.value];
        const index = criptomonedas.findIndex(c => c.id === id);

        if (index !== -1) {
            const nuevoEstado = criptomonedas[index].estado === 'Activo' ? 'Inactivo' : 'Activo';
            criptomonedas[index] = {
                ...criptomonedas[index],
                estado: nuevoEstado as 'Activo' | 'Inactivo'
            };
            this.guardarEnStorage(criptomonedas);
        }
    }

    // Método para guardar un conjunto de criptomonedas (útil para la carga inicial)
    guardarTodas(criptomonedas: Criptomoneda[]): void {
        this.guardarEnStorage(criptomonedas);
    }
}