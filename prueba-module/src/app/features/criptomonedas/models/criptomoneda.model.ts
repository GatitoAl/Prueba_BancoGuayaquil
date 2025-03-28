export interface CriptomonedaAPI {
    id: string;
    symbol: string;
    name: string;
}

export interface Criptomoneda {
    id?: string;
    codigo: string;
    nombre: string;
    descripcion?: string;
    estado: 'Activo' | 'Inactivo';
}