import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../Core/Services/usuario.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { hasEmailError, isRequired, toastCorrect, toastError } from '../../../Core/validators';
import { Router } from '@angular/router';
import { AuthResponse } from '../../../Models/auth-response';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    private readonly _formBuilder = inject(FormBuilder);
    private readonly _usuarioService = inject(UsuarioService);
    private readonly _router = inject(Router); // <-- importante para navegar

    loginForm = this._formBuilder.group({
        username: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });

    isRequired(field: string) {
        return isRequired(field, this.loginForm);
    }

    hasEmailError() {
        return hasEmailError(this.loginForm);
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const username = this.loginForm.value.username!;
            const password = this.loginForm.value.password!;
    
            this._usuarioService.login(username, password).subscribe({
            next: (response: AuthResponse) => {
                const rol = response.rol[0]; // e.g. "ROLE_CLIENTE"
    
                toastCorrect(`Has iniciado sesión como ${rol.replace('ROLE_', '')}`);
    
                // Guarda el token si lo necesitas
                localStorage.setItem('accessToken', response.token);
    
                // Navega según el rol
                switch (rol) {
                case 'ROLE_CLIENTE':
                    
                    break;
                case 'ROLE_ADMIN':
                    
                    break;
                case 'ROLE_TERAPEUTA':
                    
                    break;
                default:
                    this._router.navigate(['/']);
                }
            },
            error: (err) => {
                console.error(err);
                toastError('Usuario o contraseña incorrectos!');
            }
            });
        } else {
            toastError('Formulario incorrecto!');
        }
    }
}
