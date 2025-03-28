import { Routes } from '@angular/router';

export const CRIPTO_ROUTES: Routes = [
    {
        path: 'lista',
        loadComponent: () => import('./lista/containers/criptomoneda-lista.component')
            .then(m => m.CriptomonedaListaComponent)
    },
    {
        path: 'mantenimiento',
        loadComponent: () => import('./mantenimiento/containers/criptomoneda-mantenimiento.component')
            .then(m => m.CriptomonedaMantenimientoComponent)
    },
    {
        path: 'mantenimiento/:id',
        loadComponent: () => import('./mantenimiento/containers/criptomoneda-mantenimiento.component')
            .then(m => m.CriptomonedaMantenimientoComponent)
    },
    {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
    }
];