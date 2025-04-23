import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { CommonModule } from '@angular/common';  // Aquí es donde debe ir CommonModule
import { isRequired, hasEmailError, isValidateDNI, isValidateNum, isValidatePassword, toastCorrect, isMinPassword, toastError } from '../../../Core/validators';
import { Usuario } from '../../../Models/Entity/Usuario';
import { UsuarioService } from '../../../Core/Services/usuario.service';
import { TipoUsuario } from '../../../Models/Enums/TipoUsuario';
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
        confirmPassword: ['', Validators.required]
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
        // const usuario :Usuario =this.registerForm.value as Usuario;
        type UsuarioRegistro = Omit<Usuario, 'idPersona'>; // Exclude 'id' and 'roles' from Usuario type
        const usuario: UsuarioRegistro = {
            name: this.registerForm.value.name as string,
            lastname: this.registerForm.value.lastName as string,
            dni: this.registerForm.value.dni as string,
            username: this.registerForm.value.username as string,
            password: this.registerForm.value.password as string,
            tipoUsuario: TipoUsuario.CLIENTE,
            rol: [{ id: 1, name: 'ROLE_CLIENTE' }] 
        };

        this._usuarioService.enviarCodigo(usuario).subscribe({
            next: (response) => {
            console.log('Verification code sent successfully', response);
            toastCorrect('Verification code sent successfully!');
            console.log(usuario);
            this._router.navigate(['/authentication/verificarCodigo', usuario.username]);
            },
            error: (error) => {
            console.error('Error sending verification code', error);
            toastError('Error sending verification code');
            }
        });

        } else {
        toastError('Error sending verification code');
        }
    }
}
