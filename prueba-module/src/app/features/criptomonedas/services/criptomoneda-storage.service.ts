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
}