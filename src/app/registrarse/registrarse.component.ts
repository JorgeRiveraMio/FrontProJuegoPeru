import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isRequired, hasEmailError, isValidateDNI, isValidateNum, isValidatePassword, isMinPassword } from '../../Servicios/Validacion';
import { UsuarioService } from '../../Servicios/Service/usuario.service';
import { DniService } from '../../Servicios/Service/dni.service';
import { TutorRegistro } from '../../Modelos/Entity/Tutor';
import { EstadoTutor } from '../../Modelos/Enums/EstadoTutor';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-registrarse',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrarse.component.html',
  styleUrl: './registrarse.component.css'
})
export class RegistrarseComponent {
    private readonly _formBuilder = inject(FormBuilder);
    private readonly _router = inject(Router);
    private readonly _usuarioService = inject(UsuarioService);
    private readonly _dniService = inject(DniService);
    private readonly toastr = inject(ToastrService);

    mostrarModal = false;
    usuarioActual: string = '';

    validateForm = this._formBuilder.group({
        code: ['', Validators.required]
    });

    passwordMatchValidator(formGroup: any) {
        const password = formGroup.get('password')?.value;
        const confirmPassword = formGroup.get('confirmarPassword')?.value;
      
        if (password !== confirmPassword) {
          formGroup.get('confirmarPassword')?.setErrors({ passwordMismatch: true });
        } else {
          formGroup.get('confirmarPassword')?.setErrors(null);
        }
    }

    // Formulario de registro
    registroForm = this._formBuilder.group({
        nombre: [{ value: '', disabled: true }, [Validators.required]],
        apellido: [{ value: '', disabled: true }, [Validators.required]],
        dni: ['', [Validators.required, Validators.minLength(8)]],
        username: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmarPassword: ['', Validators.required],
        direccion: ['', []], 
        telefono: ['', []]  
    }, { validators: this.passwordMatchValidator });

    isRequired(field: string) {
      return isRequired(field, this.registroForm);
  }

  hasEmailError() {
      return hasEmailError(this.registroForm);
  }

  isValidateDNI(field: string) {
      return isValidateDNI(field, this.registroForm);
  }

  isValidateNum(field: string) {
      return isValidateNum(field, this.registroForm);
  }

  isValidatePassword() {
    const confirmarPassword = this.registroForm.get('confirmarPassword');
    return confirmarPassword?.touched && confirmarPassword?.hasError('passwordMismatch');
  }

  isMinPassword() {
      return isMinPassword(this.registroForm);
  }

  isRequiredCode() {
    return isRequired('code', this.validateForm);
  }

  consultarDni() {
      const dni = this.registroForm.get('dni')?.value;

      if (dni && dni.length === 8) {
          this._dniService.consultarDni(dni).subscribe({
          next: (data) => {
              try {
              const parsed = typeof data === 'string' ? JSON.parse(data) : data;

              const nombres = parsed.nombres;
              const apellidos = `${parsed.apellidoPaterno} ${parsed.apellidoMaterno}`;

              this.registroForm.patchValue({
                  nombre: nombres,
                  apellido: apellidos
              });
              } catch (err) {
              console.error('Error al parsear la respuesta', err);
              this.toastr.error('No se pudo obtener la información del DNI.', 'Error');
              }
          },
          error: (err) => {
              this.toastr.error('Error al consultar el DNI', 'Error');
              this.toastr.error('DNI no encontrado o error en la consulta', 'Error');
          }
          });
      } else {
        this.toastr.error('DNI inválido', 'Error');
      }
  }

  onSubmit() {
    if (this.registroForm.valid) {
    const tutor: TutorRegistro = {
      name: this.registroForm.get('nombre')?.value || '',
      lastname: this.registroForm.get('apellido')?.value || '',
      dni: this.registroForm.get('dni')?.value || '',
      username: this.registroForm.get('username')?.value || '',
      password: this.registroForm.get('password')?.value || '',
      idRol: 1,
      direccion: this.registroForm.get('direccion')?.value || '',
      telefono: this.registroForm.get('telefono')?.value || '',
      estado: EstadoTutor.ACTIVO
    };
  
      this._usuarioService.enviarCodigo(tutor).subscribe({
        next: (response) => {
          this.toastr.success('Código enviado a tu correo', 'Éxito');
          this.abrirModal(tutor.username);
        },
        error: () => this.toastr.error('Error al enviar el código', 'Error')
      });
    } else {
      this.toastr.error('Por favor completa todos los campos correctamente', 'Error');
      this.registroForm.markAllAsTouched();
    }
  }
  

  //VALIDACION DE CODIGO
  abrirModal(username: string) {
    this.usuarioActual = username;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.validateForm.reset();
  }

  onSubmitCodigo() {
    if (this.validateForm.valid) {
      const code = this.validateForm.get('code')?.value;
  
      this._usuarioService.verificarCodigo(this.usuarioActual ?? '', code ?? '').subscribe({
        next: (response) => {
          this.toastr.success('Código verificado correctamente', 'Éxito');
          this.cerrarModal();
          this._router.navigate(['/login']);
        },
        error: (err) => {
          this.toastr.error('Código incorrecto. Inténtalo nuevamente', 'Error');
        }
      });
    } else {
      this.toastr.error('Debes ingresar el código', 'Error');
      this.validateForm.markAllAsTouched();
    }
  }
}
