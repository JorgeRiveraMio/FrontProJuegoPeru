import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../Servicios/Service/usuario.service';
import { UsuarioActual } from '../../Modelos/Entity/UsuarioActual';
import { EstadoEmpleado } from '../../Modelos/Enums/EstadoEmpleado';
import { FormsModule } from '@angular/forms';
import { EmpleadoRegistro } from '../../Modelos/Entity/Empleado';

@Component({
  selector: 'app-terapeuta',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './terapeuta.component.html',
  styleUrl: './terapeuta.component.css'
})
export class TerapeutaComponent {

  isCollapsed = false;
  rolUsuario: string = '';
  nombreUsuario: string = '';
  idRol: number = 0;
  terapeutas: UsuarioActual[] = [];
  terapeutaEnEdicion: UsuarioActual | null = null;
  terapeutaNuevo: Partial<UsuarioActual> = {};
  mostrarFormulario = false;
  mostrarRegistroNuevo = false;


  constructor(
    private usuarioService: UsuarioService,
    private router: Router){}
  
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  cerrarSesion(): void {
    this.usuarioService.logout();
    this.router.navigate(['/']);
  }

  //Para obtener el usuario actual y su rol
  ngOnInit(): void {
    this.usuarioService.obtenerUsuarioActual().subscribe({
        next: (usuario: UsuarioActual) => {
          this.nombreUsuario = usuario.name || usuario.username || 'Usuario';
          this.idRol = usuario.idRol;
          console.log(usuario);
          switch (usuario.idRol) {
            case 1:
              this.rolUsuario = 'ROLE_TUTOR';
              break;
            case 2:
              this.rolUsuario = 'ROLE_ADMIN';
              break;
            case 3:
              this.rolUsuario = 'ROLE_TERAPEUTA';
              break;
            default:
              this.rolUsuario = '';
          }
          if(this.rolUsuario === 'ROLE_ADMIN') {
            this.cargarTerapeutas();
          }
      }
  });
}

cargarTerapeutas(): void {
  this.usuarioService.ListarTerapeutas().subscribe({
    next: (data) => {
      this.terapeutas = data.filter(t => 
        t.rol?.id === 3
        
      );
      console.log('Terapeutas recibidos:', data);
    },
    error: (err) => console.error('Error al cargar terapeutas:', err)
  });
}

//boton para crear un nuevo terapeuta
nuevo(): void {
  this.terapeutaNuevo = {
    name: '',
    lastname: '',
    dni: '',
    username: '',
    password: '',
    especialidad: '',
    estadoEmpleado: 'ACTIVO',
    idRol: 3
  };
  this.mostrarRegistroNuevo = true;
}

cerrarRegistroNuevo(): void {
  this.mostrarRegistroNuevo = false;
  this.terapeutaNuevo = {};
}

guardarNuevoTerapeuta(): void {
  if (!this.terapeutaNuevo) return;

  if (!this.terapeutaNuevo.name || !this.terapeutaNuevo.lastname || !this.terapeutaNuevo.dni ||
      !this.terapeutaNuevo.username || !this.terapeutaNuevo.password || !this.terapeutaNuevo.especialidad) {
    alert('Por favor, completa todos los campos obligatorios.');
    return;
  }

  const payload: EmpleadoRegistro = {
    name: this.terapeutaNuevo.name,
    lastname: this.terapeutaNuevo.lastname,
    dni: this.terapeutaNuevo.dni,
    username: this.terapeutaNuevo.username,
    password: this.terapeutaNuevo.password,
    especialidad: this.terapeutaNuevo.especialidad,
    estadoEmpleado: this.terapeutaNuevo.estadoEmpleado === 'ACTIVO' ? 0 : 1,
    idRol: 3
  };

  this.usuarioService.registrarTerapeuta(payload).subscribe({
    next: () => {
      alert('Terapeuta creado correctamente');
      this.cerrarRegistroNuevo();
      this.cargarTerapeutas();
    },
    error: (err) => {
      console.error('Error al crear terapeuta:', err);
      alert('Ocurrió un error al crear el terapeuta');
    }
  });
}


editar(t: UsuarioActual){
  this.terapeutaEnEdicion = { ...t };
  this.mostrarFormulario = true;
}

guardar(){
  if(!this.terapeutaEnEdicion) return;
  const payload = {
    ...this.terapeutaEnEdicion,
    estadoEmpleado: this.terapeutaEnEdicion.estadoEmpleado === 'ACTIVO' ? 0 : 1,
    idRol: 3
  };
  
  this.usuarioService.actualizarTerapeuta(this.terapeutaEnEdicion.idUsuario, payload).subscribe({
    next: () => {
      alert('Terapeuta actualizado correctamente');
      this.mostrarFormulario = false;
      this.terapeutaEnEdicion = null;
      this.cargarTerapeutas(); // refresca la lista
    },
    error: (err) => {
      console.error('Error al actualizar terapeuta:', err);
      alert('Ocurrió un error al actualizar el terapeuta');
    }
  });
}

cancelarEdicion(): void {
  this.mostrarFormulario = false;
  this.terapeutaEnEdicion = null;
}

eliminar(idUsuario: number): void {
  if (confirm('¿Estás seguro de eliminar este terapeuta?')) {
    this.usuarioService.eliminarTerapeuta(idUsuario).subscribe({
      next: (resp) => {
        console.log('Respuesta al eliminar:', resp);
        alert('Terapeuta eliminado correctamente');
        this.cargarTerapeutas();
      },
      error: (err) => {
    if (err.status === 200) {
      this.cargarTerapeutas();
    } else {
      console.error('Error al eliminar terapeuta:', err);
      alert('Ocurrió un error al eliminar el terapeuta');
    }
  }
    });
  }
}

}
