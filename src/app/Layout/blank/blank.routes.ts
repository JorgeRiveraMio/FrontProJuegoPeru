import { Component } from "@angular/core";
import { BlankComponent } from "./blank.component";
import { Routes } from "@angular/router";

export default[
    {
        path: '',
        component: BlankComponent,
        children: [
            {
                path: 'authentication',
                loadChildren:()=>import('../../Features/Auth/auth.routes').then(m => m.default),
            }
          
        ]
    }
]as Routes;