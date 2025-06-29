import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../Servicios/Service/usuario.service';
import { UsuarioActual } from '../../Modelos/Entity/UsuarioActual';
import { EmpleadoRegistro } from '../../Modelos/Entity/Empleado';
import { EstadoEmpleado } from '../../Modelos/Enums/EstadoEmpleado';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-perfil',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './edit-perfil.component.html',
  styleUrl: './edit-perfil.component.css'
})
export class EditPerfilComponent {
  
  isCollapsed = false;
  perfilForm!: FormGroup;
  cargando = true;
  rolUsuario: string = '';
  nombreUsuario: string = '';
  idUsuario: number = 0;
  idRol: number = 0;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
  this.perfilForm = this.fb.group({
    name: [{value: '', disabled: true}],
    lastname: [{value: '', disabled: true}],
    dni: [{value: '', disabled: true}],
    username: [{value: '', disabled: true}],
    password: [''],
    telefono: [{value: '', disabled: true}],
    direccion: [{value: '', disabled: true}],
    especialidad: [{value: '', disabled: true}]  // campo solo lectura para admin
  });

  this.usuarioService.obtenerUsuarioActual().subscribe({
    next: (usuario: UsuarioActual) => {
      this.nombreUsuario = usuario.name || usuario.username || 'Usuario';
      this.idUsuario = usuario.idUsuario || usuario.idUsuario || 0;
      this.idRol = usuario.idRol;
      console.log(usuario);
      switch (usuario.idRol) {
        case 1:
          this.rolUsuario = 'ROLE_TUTOR';
          break;
        case 2:
          console.log(usuario.idUsuario);
          this.rolUsuario = 'ROLE_ADMIN';
          break;
        case 3:
          this.rolUsuario = 'ROLE_TERAPEUTA';
          break;
        default:
          this.rolUsuario = '';
      }

      // Patch valores comunes
      this.perfilForm.patchValue({
        name: usuario.name || '',
        lastname: usuario.lastname || '',
        dni: usuario.dni || '',
        username: usuario.username || '',
        telefono: usuario.telefono || '',
        direccion: usuario.direccion || '',
        especialidad: usuario.especialidad || ''
      });

      if (this.rolUsuario === 'ROLE_ADMIN') {
        // Deshabilitar todos los campos excepto contraseña y especialidad
        this.perfilForm.get('password')?.enable();
        this.perfilForm.get('especialidad')?.disable(); // solo lectura

        ['name', 'lastname', 'dni', 'username', 'telefono', 'direccion'].forEach(field => {
          this.perfilForm.get(field)?.disable();
        });
      } else {
        this.perfilForm.get('password')?.enable();
        this.perfilForm.get('telefono')?.enable();
        this.perfilForm.get('direccion')?.enable();
      }

      this.cargando = false;
    },
    error: () => {
      this.nombreUsuario = 'Usuario';
      this.rolUsuario = '';
      this.cargando = false;
    }
  });
}

  guardar(): void {
    if (this.rolUsuario === 'ROLE_ADMIN') {
      this.guardarAdmin();
    } else if (this.rolUsuario === 'ROLE_TUTOR' || this.rolUsuario === 'ROLE_TERAPEUTA') {
      this.guardarTutor();
    } else {
      this.toastr.error('Rol no permitido para actualizar perfil', 'Error');
    }
  }

  //guardar admin
  guardarAdmin(): void {
    const raw = this.perfilForm.getRawValue();

    if (!this.idUsuario) {
      this.toastr.error('ID del usuario no disponible', 'Error');
      return;
    }

    const payload: EmpleadoRegistro = {
      name: raw.name,
      lastname: raw.lastname,
      dni: raw.dni,
      username: raw.username,
      idRol: this.idRol,
      password: raw.password || '',
      especialidad: raw.especialidad,
      estadoEmpleado: EstadoEmpleado.ACTIVO,
    };

    this.usuarioService.actualizarEmpleado(this.idUsuario, payload).subscribe({
      next: () =>  this.toastr.success('Perfil admin actualizado correctamente', 'Éxito'),
      error: (err) => this.toastr.error('Error al actualizar admin:', (err.error?.message || ''))
    });
  }

  guardarTutor(): void {
    const raw = this.perfilForm.getRawValue();

    let payload: any = {
      username: raw.username,
      name: raw.name,
      lastname: raw.lastname,
      dni: raw.dni
    };

    if (raw.password && raw.password.trim() !== '') {
      payload.password = raw.password;
    }

    if (raw.telefono && raw.telefono.trim() !== '') {
      payload.telefono = raw.telefono;
    }

    if (raw.direccion && raw.direccion.trim() !== '') {
      payload.direccion = raw.direccion;
    }

    this.usuarioService.completarPerfil(payload).subscribe({
      next: () => this.toastr.success('Perfil actualizado correctamente', 'Éxito'),
      error: (err) => this.toastr.error('Error al actualizar tutor:', (err.error?.message || ''))
    });
  }

  
  cerrarSesion(): void {
    this.usuarioService.logout();
    this.router.navigate(['/']);
  }

}
