import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ValidateCodeComponent } from './validate-code/validate-code.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';  
import { ResetPasswordComponent } from './reset-password/reset-password.component';  

export const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent, // Asegúrate de crear este componente
  },
  {
    path: 'register',
    component: RegisterComponent, // Este es el componente para el registro de usuarios
  },
  {
    path: 'reset-password/:username',
    component: ResetPasswordComponent, // Componente para el restablecimiento de contraseña
  },
  {
    path: 'verificarCodigo/:username',
    component: ValidateCodeComponent, // Verificación de código, ya la tienes configurada
  }
];
