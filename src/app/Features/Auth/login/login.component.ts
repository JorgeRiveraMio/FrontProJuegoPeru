import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../Core/Services/usuario.service';
import { hasEmailError, isRequired, toastCorrect, toastError } from '../../../Core/validators';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    private readonly _formBuilder = inject(FormBuilder);
    private readonly _router = inject(Router);
    private readonly _usuarioService = inject(UsuarioService);

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
            const username = this.loginForm.value.username;
            const password = this.loginForm.value.password

            this._usuarioService.login(username!, password!).subscribe({
                next :(response) => {
                    toastCorrect('El codigo es correcto!');
                },
                error:(error) => {
                    toastError('Usuario o contraseña incorrectos!');
                }
            })

        }else{
            toastError(' incorrecto!');
        }
   }
}
