import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { hasEmailError, isRequired } from '../../Servicios/Validacion';
import { UsuarioService } from '../../Servicios/Service/usuario.service';
import { AuthResponse } from '../../Modelos/auth-response';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private router: Router) {}
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _usuarioService = inject(UsuarioService);
  private readonly _router = inject(Router);
  private readonly toastr = inject(ToastrService);
  mostrarRecuperar = false;

  irARecuperar() {
    this.mostrarRecuperar = true;
  }

  volverAlLogin() {
    this.mostrarRecuperar = false;
  }

  loginForm = this._formBuilder.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
});

recuperarForm = this._formBuilder.group({
  username: ['', [Validators.required, Validators.email]],
});

isRequired(field: string) {
    return isRequired(field, this.loginForm);
}

hasEmailError() {
    return hasEmailError(this.loginForm);
}
// Cuando presionas "Ingresar"
onSubmitLogin() {
  if (this.loginForm.valid) {
    const username = this.loginForm.value.username!;
    const password = this.loginForm.value.password!;

    this._usuarioService.login(username, password).subscribe({
      next: (response: AuthResponse) => {
        const rol = response.rol[0];
        //console.info(`Has iniciado sesión como ${rol.replace('ROLE_', '')}`);
        //console.log('Token recibido:', response.jwt);
        localStorage.setItem('accessToken', response.jwt);

        switch (rol) {
          case 'ROLE_TUTOR':
            this.router.navigate(['/inicio-principal']);
            break;
          case 'ROLE_ADMIN':
            this.router.navigate(['/inicio-principal']);
            break;
          case 'ROLE_TERAPEUTA':
            this.router.navigate(['/inicio-principal']);
            break;
          default:
            this._router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Error al iniciar sesión', 'Por favor verifica tus credenciales');
      }
    });
  } else {
    this.loginForm.markAllAsTouched();
    this.toastr.error('Debe ingresar un correo y contraseña válidos', 'Error');
  }
}

// Cuando presionas "Enviar código de recuperación"
onSubmitRecuperar() {
  if (this.recuperarForm.invalid) {
    this.recuperarForm.markAllAsTouched();
    this.toastr.error('Debe ingresar un correo válido', 'Error');
    return;
  }

  const username = this.recuperarForm.value.username!;

  this._usuarioService.forgotPassword(username).subscribe({
    next: () => {
      this.toastr.success('Se ha enviado un código de recuperación a tu correo', 'Éxito');
    },
    error: (err) => {
      console.error(err);
    }
  });
}

irACrearCuenta() {
  this.router.navigate(['/registrarse']);
}

}
