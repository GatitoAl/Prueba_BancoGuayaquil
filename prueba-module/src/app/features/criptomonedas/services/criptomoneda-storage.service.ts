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

    //Funcion para guardar en la sesion storage
    private guardarEnStorage(criptomonedas: Criptomoneda[]): void {
        sessionStorage.setItem(this.storageKey, JSON.stringify(criptomonedas));
        this.criptomonedasSubject.next(criptomonedas);
    }

    //Funcion para obtener todo
    obtenerTodas(): Observable<Criptomoneda[]> {
        return this.criptomonedasSubject.asObservable();
    }

    //Funcion para guardar
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

    //Funcion para eliminar
    eliminar(id: string): void {
        const criptomonedas = this.criptomonedasSubject.value.filter(c => c.id !== id);
        this.guardarEnStorage(criptomonedas);
    }

    //Funcion para crear favoritos
    toggleFavorito(id: string): void {
        const criptomonedas = [...this.criptomonedasSubject.value];
        const index = criptomonedas.findIndex(c => c.id === id);

        if (index !== -1) {
            criptomonedas[index] = {
                ...criptomonedas[index],
                favorito: !criptomonedas[index].favorito
            };
            console.log('Toggle favorito para:', criptomonedas[index]); // Verifica con console.log
            this.guardarEnStorage(criptomonedas);
        }
    }

    // Funcion para activar o desactivar
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

    // Funcion para guardar
    guardarTodas(criptomonedas: Criptomoneda[]): void {
        this.guardarEnStorage(criptomonedas);
    }
}