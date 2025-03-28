import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Criptomoneda, CriptomonedaAPI } from '../models/criptomoneda.model';

@Injectable({
    providedIn: 'root'
})
export class CriptomonedaApiService {
    private apiUrl = 'https://api.coingecko.com/api/v3/coins/list'; // URL de ejemplo

    constructor(private http: HttpClient) { }

    obtenerCriptomonedas(): Observable<Criptomoneda[]> {
        return this.http.get<CriptomonedaAPI[]>(this.apiUrl).pipe(
            map(data => data.slice(0, 100).map(item => ({
                id: item.id,
                codigo: item.symbol,
                nombre: item.name,
                descripcion: `Criptomoneda basada en ${item.name}`,
                estado: 'Activo' as 'Activo' | 'Inactivo',
                favorito: false
            })))
        );
    }
}