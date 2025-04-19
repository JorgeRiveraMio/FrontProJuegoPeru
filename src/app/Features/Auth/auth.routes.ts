import { Routes } from '@angular/router';
import path from 'path';

export default[
    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    },
    {
        path: 'register',
        loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
    }

]as Routes;