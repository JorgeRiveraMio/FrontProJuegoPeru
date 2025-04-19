import { Routes } from '@angular/router';
import { BlankComponent } from './Layout/blank/blank.component';
import { FullComponent } from './Layout/full/full.component';

export const routes: Routes = [

    {
        path: '',
        loadChildren: () => import('../app/Layout/blank/blank.routes'),
        
    },
    {
        path: '',
        loadChildren: () => import('../app/Layout/full/full.routes'),
    },
    {
        path: '**',
        redirectTo: 'authentication/login'
    }
];
