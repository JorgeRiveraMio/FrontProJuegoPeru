import { Component } from '@angular/core';
import { UsuarioService } from '../../Servicios/Service/usuario.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { tipoSesionService } from '../../Servicios/Service/tipo-sesion.service';
import { TipoSesion } from '../../Modelos/Entity/TipoSesion';
import { FormsModule } from '@angular/forms';
import { NombreTipoSesion } from '../../Modelos/Enums/NombreTipoSesion';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-tipo-sesion',
  imports: [CommonModule, FormsModule],
  templateUrl: './tipo-sesion.component.html',
  styleUrl: './tipo-sesion.component.css'
})
export class TipoSesionComponent {

  isCollapsed = false;
  nombreUsuario: string = '';
  rolUsuario: string = '';
  idUsuario: number = 0;
  tiposSesion: TipoSesion[] = [];
  tipoSeleccionado: TipoSesion = this.resetTipo();
  nombreEnum = NombreTipoSesion;
  nombreKeys: string[] = [];
  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private tipoSesionService: tipoSesionService,
    private toastr: ToastrService
  ) {}


  ngOnInit(): void {
    this.nombreKeys = Object.keys(this.nombreEnum).filter(key => isNaN(Number(key)));
    this.usuarioService.obtenerUsuarioActual().subscribe({
      next: (usuario) => {
        this.nombreUsuario = usuario.name || usuario.username || 'Usuario';
        this.idUsuario = usuario.idUsuario;
        this.rolUsuario = this.obtenerRol(usuario.idRol);

        if (this.rolUsuario === 'ROLE_ADMIN') {
          this.cargarTiposSesion();
        }
      },
      error: () => {
        this.nombreUsuario = 'Usuario';
        this.rolUsuario = '';
      }
    });
  }

  obtenerRol(idRol: number): string {
    switch (idRol) {
      case 1: return 'ROLE_TUTOR';
      case 2: return 'ROLE_ADMIN';
      case 3: return 'ROLE_TERAPEUTA';
      default: return '';
    }
  }

  cerrarSesion(): void {
    this.usuarioService.logout();
    this.router.navigate(['/']);
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  cargarTiposSesion() {
    this.tipoSesionService.listarTodos().subscribe({
      next: (data) => this.tiposSesion = data,
      error: () => this.toastr.error('Error al cargar los tipos de sesión', 'Error'),
    });
  }

  guardarTipo() {
    if (this.tipoSeleccionado.id === 0) {
      this.tipoSesionService.guardar(this.tipoSeleccionado).subscribe(() => {
        this.cargarTiposSesion();
        this.toastr.success('Tipo de sesión guardado correctamente', 'Éxito');
        this.tipoSeleccionado = this.resetTipo();
      });
    } else {
      this.tipoSesionService.actualizar(this.tipoSeleccionado).subscribe(() => {
        this.cargarTiposSesion();
        this.toastr.info('Tipo de sesión actualizado correctamente', 'Éxito');
        this.tipoSeleccionado = this.resetTipo();
      });
    }
  }

  editarTipo(tipo: TipoSesion) {
    this.tipoSeleccionado = { ...tipo };
  }

  eliminarTipo(id: number) {
    if (confirm('¿Estás seguro de eliminar este tipo de sesión?')) {
      this.tipoSesionService.eliminar(id).subscribe(() => {
        this.toastr.error('Tipo de sesión eliminado correctamente', 'Éxito');
        this.cargarTiposSesion();
      });
    }
  }

  resetTipo(): TipoSesion {
    return {
      id: 0,
      nombre: undefined as unknown as NombreTipoSesion,
      descripcion: '',
      costo: 0
    };
  }

}
