import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

export const APP_ROUTES: Routes = [
    {
        path: 'criptomonedas',
        loadChildren: () =>
            loadRemoteModule({
                type: 'module',
                remoteEntry: 'http://localhost:4201/remoteEntry.js',
                exposedModule: './Module'
            }).then(m => m.CriptomonedasModule)
    },
    {
        path: '',
        redirectTo: 'criptomonedas',
        pathMatch: 'full'
    }
];