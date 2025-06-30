import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../Servicios/Service/usuario.service';
import { TerapeutaService } from '../../Servicios/Service/terapeuta.service';
import { ToastrService } from 'ngx-toastr';
import { UsuarioActual } from '../../Modelos/Entity/UsuarioActual';
import { TutorRegistro } from '../../Modelos/Entity/Tutor';
import { UsuarioRegistro } from '../../Modelos/Entity/Usuario';

@Component({
  selector: 'app-tutores',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tutores.component.html',
  styleUrl: './tutores.component.css'
})
export class TutoresComponent {
  form: FormGroup;
  isCollapsed = false;
  cargando = true;
  nombreUsuario: string = '';
  rolUsuario: string = '';
  tutores: UsuarioActual[] = [];

  constructor(private usuarioService: UsuarioService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      dni: ['', [Validators.required, Validators.minLength(8)]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      idRol: [1], // si tu Rol de TUTOR es 4
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      estado: ['ACTIVO'] // o 'INACTIVO'
    });
  }

  ngOnInit(): void {
    this.cargarUsuario();
    this.obtenerTutores();
  }

  cargarUsuario(): void {
      this.cargando = true;
      this.usuarioService.obtenerUsuarioActual().subscribe({
        next: (usuario: UsuarioActual) => {
          this.nombreUsuario = usuario.name || usuario.username || 'Usuario';
          this.rolUsuario = this.obtenerRolUsuario(usuario.idRol);
      },
        error: () => {
          this.nombreUsuario = 'Usuario';
          
        },
        complete: () => {
          this.cargando = false;
        }
      });
    }
  
    // Método para obtener el rol del usuario
    obtenerRolUsuario(idRol: number): string {
      switch (idRol) {
        case 1: return 'ROLE_TUTOR';
        case 2: return 'ROLE_ADMIN';
        case 3: return 'ROLE_TERAPEUTA';
        default: return '';
      }
    }

    toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  cerrarSesion(): void {
    this.usuarioService.logout();
    this.router.navigate(['/']);
  }

  registrarTutor(): void {
  if (this.form.invalid) {
    this.toastr.warning('Por favor complete todos los campos obligatorios.', 'Formulario inválido');
    return;
  }

  const datosFormulario = this.form.value;

  const nuevoTutor: UsuarioRegistro = {
    name: datosFormulario.name,
    lastname: datosFormulario.lastname,
    dni: datosFormulario.dni,
    username: datosFormulario.username,
    password: datosFormulario.password,
    idRol: 1 // ROLE_TUTOR
  };

  this.usuarioService.registrarTutorComoAdmin(nuevoTutor).subscribe({
    next: () => {
      this.toastr.success('Tutor registrado con éxito', 'Éxito');
      this.form.reset(); // limpia el formulario
    },
    error: (err) => {
      this.toastr.error(err.error?.message || 'Error al registrar tutor', 'Error');
    }
  });
}

obtenerTutores(): void {
  this.usuarioService.obtenerTutores().subscribe({
    next: (data) => {
      this.tutores = data;
    },
    error: () => {
      this.toastr.error('No se pudieron cargar los tutores.', 'Error');
    }
  });
}

}
