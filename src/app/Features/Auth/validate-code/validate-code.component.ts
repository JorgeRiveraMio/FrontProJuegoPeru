import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../Core/Services/usuario.service';
import { isRequired, toastCorrect, toastError } from '../../../Core/validators';

@Component({
  selector: 'app-validate-code',
  imports: [ReactiveFormsModule],
  templateUrl: './validate-code.component.html',
  styleUrl: './validate-code.component.css'
})
export class ValidateCodeComponent {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _usuarioService = inject(UsuarioService);
  username : string ='';
 
  
 validateForm = this._formBuilder.group({
    code: ['', Validators.required],
  });
  ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this.username = params.get('username')!;
      console.log('Username:', this.username); // Verifica que el username se obtenga correctamente
    });
  }
  isRequired(field: string) {
      return isRequired(field, this.validateForm);
  }
  
  onSubmit() {
    if (this.validateForm.valid) {
      const code = this.validateForm.value.code;
      console.log('Form is valid',code);
      this._usuarioService.verificarCodigo(this.username, code!).subscribe({
        next:() => {
            toastCorrect('El codigo es correcto!');
            this._router.navigate(['/authentication/login']);
        },
        error:(err) => {
          console.error(err);
          toastError('El codigo es incorrecto!');
        }
      })


    } else {
      toastError('El codigo es incorrecto!');
    }
    console.log(this.username);
  }
}
