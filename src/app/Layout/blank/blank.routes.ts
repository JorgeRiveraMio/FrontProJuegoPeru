import { Component } from "@angular/core";
import { BlankComponent } from "./blank.component";
import { Routes } from "@angular/router";

export const blankRoutes: Routes = [
    {
      path: '',
      component: BlankComponent,
      children: [
        {
          path: 'authentication',
          loadChildren: () =>
            import('../../Features/Auth/auth.routes').then((m) => m.authRoutes),
        },
        {
          path: '',
          redirectTo: 'authentication/login', // corregido aquí
          pathMatch: 'full',
        },
      ],
    },
  ];