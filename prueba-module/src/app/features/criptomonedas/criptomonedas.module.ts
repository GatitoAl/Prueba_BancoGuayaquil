import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CRIPTO_ROUTES } from './criptomonedas.routes';

@NgModule({
    imports: [RouterModule.forChild(CRIPTO_ROUTES)],
})
export class CriptomonedasModule { }