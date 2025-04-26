import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../Core/Services/usuario.service';
import { toastCorrect, toastError } from '../../../Core/validators';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(UsuarioService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);  // Inyecta ChangeDetectorRef

  resetForm = this._fb.group({
    token: ['', Validators.required],
    nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.resetForm.get('token')?.setValue(token);
      } else {
        toastError('Token no válido en la URL');
        this._router.navigate(['/authentication/forgot-password']);
      }
    });
  }

  isRequired(field: string): boolean {
    const control = this.resetForm.get(field);
    return !!(control && control.hasError('required') && control.touched);
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }
  
    const { token, nuevaContrasena } = this.resetForm.value;
  
    this._authService.resetPassword(token!, nuevaContrasena!).subscribe({
      next: () => {
        toastCorrect('Contraseña actualizada correctamente');
        
        setTimeout(() => {
          this._router.navigate(['/authentication/login']);
        }, 0);
      },
      error: (err) => {
        console.error(err);
        toastError('Token inválido o expirado');
      },
    });
  }
  
}
