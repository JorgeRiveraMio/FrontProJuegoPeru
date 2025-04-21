import { Routes } from '@angular/router';
import path from 'path';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ValidateCodeComponent } from './validate-code/validate-code.component';

export const authRoutes:Routes =[
   
    {
        path: 'login',
        component:LoginComponent
      }
    ,
    {
        path: 'register',
       component:RegisterComponent
    },
    {
      path:'verificarCodigo/:username',
      component:ValidateCodeComponent
    }

]