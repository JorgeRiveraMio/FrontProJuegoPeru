import { Component, inject } from '@angular/core';
import{ FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { isRequired,hasEmailError, isValidateDNI, isValidateNum, isValidatePassword, toastCorrect, isMinPassword, toastError } from '../../../Core/validators';
import { Usuario } from '../../../Models/Entity/Usuario';
import { UsuarioService } from '../../../Core/Services/usuario.service';
import { TipoUsuario } from '../../../Models/Enums/TipoUsuario';
@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule,RouterLink],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    private readonly _formBuilder = inject(FormBuilder);
    private readonly _router = inject(Router);
    private readonly _usuarioService = inject(UsuarioService);
   

    registerForm = this._formBuilder.group({
        name: ['', Validators.required ],
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

    onSubmit() {
        if (this.registerForm.valid) {
            // const usuario :Usuario =this.registerForm.value as Usuario;
            type UsuarioRegistro = Omit<Usuario, 'idPersona' >; // Exclude 'id' and 'roles' from Usuario type
            const usuario: UsuarioRegistro = {
                name: this.registerForm.value.name as string,
                lastname:this.registerForm.value.lastName as string,
                dni: this.registerForm.value.dni as string,         
                username: this.registerForm.value.username as string,
                password: this.registerForm.value.password as string,
                tipoUsuario:TipoUsuario.CLIENTE, 
                roles:['CLIENTE']// puedes ajustar según lo que quieras enviar
            };
            
            this._usuarioService.enviarCodigo(usuario).subscribe({
                next: (response) => {
                    console.log('Verification code sent successfully', response);
                    toastCorrect('Verification code sent successfully!');
                    console.log(usuario);
                    this._router.navigate(['/authentication/verificarCodigo',usuario.username]);
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
