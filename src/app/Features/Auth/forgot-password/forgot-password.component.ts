import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../Core/Services/usuario.service';
import { toastCorrect, toastError } from '../../../Core/validators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // 👈 esto es clave para que funcione [formGroup]
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: UsuarioService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
    });
  }

  isRequired(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.hasError('required') && control.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  
    const { username } = this.form.value;
  
    this.authService.forgotPassword(username).subscribe({
      next: () => {
        toastCorrect('Correo enviado correctamente. Revisa tu bandeja de entrada.');
        // No redirigimos a ningún lado
      },
      error: (err) => {
        console.error(err);
        toastError('Correo no encontrado');
      },
    });
  }
  
}
