import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    loadComponent: () => import('./inicio/inicio.component').then(m => m.InicioComponent)
    },
    {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'registrarse',
        loadComponent: () => import('./registrarse/registrarse.component').then(m => m.RegistrarseComponent)
    },
    {
        path: 'inicio-principal',
        loadComponent: () => import('./inicio-principal/inicio-principal.component').then(m => m.InicioPrincipalComponent)
    },
    {
        path: 'edit-perfil',
        loadComponent: () => import('./edit-perfil/edit-perfil.component').then(m => m.EditPerfilComponent)
    },
    {
        path: 'terapeuta',
        loadComponent: () => import('./terapeuta/terapeuta.component').then(m => m.TerapeutaComponent)
    }
];