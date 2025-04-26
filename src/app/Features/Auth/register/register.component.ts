import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isRequired, hasEmailError, isValidateDNI, isValidateNum, isValidatePassword, toastCorrect, isMinPassword, toastError } from '../../../Core/validators';
import { ClienteRegistro } from '../../../Models/Entity/Cliente'; 
import { UsuarioService } from '../../../Core/Services/usuario.service';
import { TipoUsuario } from '../../../Models/Enums/TipoUsuario';
import { EstadoCliente } from '../../../Models/Enums/EstadoCliente'; 
import { DniService } from '../../../Core/Services/dni.service';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    private readonly _formBuilder = inject(FormBuilder);
    private readonly _router = inject(Router);
    private readonly _usuarioService = inject(UsuarioService);
    private readonly _dniService = inject(DniService);

    registerForm = this._formBuilder.group({
        name: ['', Validators.required],
        lastName: ['', Validators.required],
        dni: ['', [Validators.required, Validators.minLength(8)]],
        username: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        direccion: ['', []], 
        telefono: ['', []]   
    });


    isRequired(field: string) {
        return isRequired(field, this.registerForm);
    }

    hasEmailError() {
        return hasEmailError(this.registerForm);
    }

    isValidateDNI(field: string) {
        return isValidateDNI(field, this.registerForm);
    }

    isValidateNum(field: string) {
        return isValidateNum(field, this.registerForm);
    }

    isValidatePassword() {
        return isValidatePassword(this.registerForm);
    }

    isMinPassword() {
        return isMinPassword(this.registerForm);
    }

    consultarDni() {
        const dni = this.registerForm.get('dni')?.value;

        if (dni && dni.length === 8) {
            this._dniService.consultarDni(dni).subscribe({
            next: (data) => {
                try {
                const parsed = typeof data === 'string' ? JSON.parse(data) : data;

                const nombres = parsed.nombres;
                const apellidos = `${parsed.apellidoPaterno} ${parsed.apellidoMaterno}`;

                this.registerForm.patchValue({
                    name: nombres,
                    lastName: apellidos
                });
                } catch (err) {
                console.error('Error al parsear la respuesta', err);
                toastError('No se pudo obtener la información del DNI.');
                }
            },
            error: (err) => {
                console.error('Error consultando DNI', err);
                toastError('DNI no encontrado o error en la consulta.');
            }
            });
        } else {
            toastError('DNI inválido');
        }
    }

    onSubmit() {
    if (this.registerForm.valid) {
        const cliente: ClienteRegistro = {
            name: this.registerForm.value.name!,
            lastname: this.registerForm.value.lastName!,
            dni: this.registerForm.value.dni!,
            username: this.registerForm.value.username!,
            password: this.registerForm.value.password!,
            tipoUsuario: TipoUsuario.CLIENTE,
            rol: { id: 1, name: 'ROLE_CLIENTE' }, // 👈 Un objeto Rol
            direccion: this.registerForm.value.direccion!,
            telefono: this.registerForm.value.telefono!,
            estado: EstadoCliente.ACTIVO
        };

        this._usuarioService.enviarCodigo(cliente).subscribe({
            next: (response) => {
            console.log('Respuesta del backend:', response);
            toastCorrect('Código enviado!');
            this._router.navigate(['/authentication/verificarCodigo', cliente.username]);
            },
            error: () => toastError('Error enviando el código')
        });
        } else {
        toastError('Completa todos los campos!');
        }
    }
}
