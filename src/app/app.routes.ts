import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    loadComponent: () => import('./landing_pagee/inicio/inicio.component').then(m => m.InicioComponent)
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
    },
    {
        path: 'tutelados',
        loadComponent: () => import('./tutelados/tutelados.component').then(m => m.TuteladosComponent)
    },
    {
        path: 'disponibilidad',
        loadComponent: () => import('./disponibilidad/disponibilidad.component').then(m => m.DisponibilidadComponent)
    },
    {
        path: 'tutores',
        loadComponent: () => import('./tutores/tutores.component').then(m => m.TutoresComponent)
    },
    {
        path: 'disponibilidad-terapeuta',
        loadComponent: () => import('./disponibilidad-terapeuta/disponibilidad-terapeuta.component').then(m => m.DisponibilidadTerapeutaComponent)
    },
    {
        path: 'sesion',
        loadComponent: () => import('./sesion/sesion.component').then(m => m.SesionComponent)
    },
    {
        path: 'tipo-sesion',
        loadComponent: () => import('./tipo-sesion/tipo-sesion.component').then(m => m.TipoSesionComponent)
    },
    {
        path: 'registro-sesion',
        loadComponent: () => import('./registro-sesion/registro-sesion.component').then(m => m.RegistroSesionComponent)
    }
];