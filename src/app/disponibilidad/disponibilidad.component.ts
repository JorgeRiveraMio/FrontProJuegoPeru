import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../Servicios/Service/usuario.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioActual } from '../../Modelos/Entity/UsuarioActual';
import { Empleado } from '../../Modelos/Entity/Empleado';
import { EstadoEmpleado } from '../../Modelos/Enums/EstadoEmpleado';

@Component({
  selector: 'app-disponibilidad',
  imports: [CommonModule, RouterModule],
  templateUrl: './disponibilidad.component.html',
  styleUrl: './disponibilidad.component.css'
})
export class DisponibilidadComponent implements OnInit {

  terapeutas: Empleado[] = [];
  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  isCollapsed = false;
  cargando = true;
  nombreUsuario: string = '';
  rolUsuario: string = '';
  IdEncargado: number = 0;

  constructor(private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarTerapeutas();
    this.cargarUsuario();
  }

  cargarTerapeutas(): void {
  this.usuarioService.ListarTerapeutas().subscribe({
    next: (data: UsuarioActual[]) => {
      this.terapeutas = data.map(usuario => ({
        ...usuario,
        estadoEmpleado: usuario.estadoEmpleado === 'ACTIVO'
          ? EstadoEmpleado.ACTIVO
          : EstadoEmpleado.INACTIVO
      })) as Empleado[];
    },
    error: (err) => {
      console.error('Error al cargar terapeutas:', err);
    }
  });
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


  obtenerEstadoTexto(estado: string | number | undefined): string {
  if (estado === 0 || estado === 'ACTIVO') return 'Activo';
  if (estado === 1 || estado === 'INACTIVO') return 'Inactivo';
  return 'Desconocido';
}

   toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  cerrarSesion(): void {
    this.usuarioService.logout();
    this.router.navigate(['/']);
  }

  abrirModalCrear(terapeuta: Empleado): void {
  console.log('Crear nueva hora para', terapeuta);
  // Aquí abrirás un modal o activas un formulario específico
}

abrirModalEditar(terapeuta: Empleado): void {
  console.log('Editar disponibilidad de', terapeuta);
  // Aquí puedes abrir un modal de edición con los datos cargados
}

eliminarDisponibilidad(terapeuta: Empleado): void {
  if (confirm(`¿Deseas eliminar toda la disponibilidad de ${terapeuta.name}?`)) {
    // Aquí va la llamada al servicio para eliminar
    console.log('Eliminando disponibilidad de', terapeuta);
  }
}

}
