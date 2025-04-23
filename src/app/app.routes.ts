import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './Layout/blank/blank.component';
import { FullComponent } from './Layout/full/full.component';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/authentication/login', // Redirige a la página de login
    pathMatch: 'full', // Asegura que la redirección solo ocurra si el path es exacto
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./Features/Auth/auth.routes').then((m) => m.authRoutes),
      },
    ],
  },
  {
    path: 'page',
    component: FullComponent,
  },
];

