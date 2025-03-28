import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CriptomonedaAPI } from '../models/criptomoneda.model';

@Injectable({
    providedIn: 'root'
})
export class CriptomonedaApiService {
    private apiUrl = 'https://api.coingecko.com/api/v3/coins/list';

    constructor(private http: HttpClient) { }

    obtenerCriptomonedas(): Observable<CriptomonedaAPI[]> {
        return this.http.get<CriptomonedaAPI[]>(this.apiUrl);
    }
}