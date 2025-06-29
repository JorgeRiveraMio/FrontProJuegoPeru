import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../Servicios/Service/usuario.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioActual } from '../../Modelos/Entity/UsuarioActual';
import { Empleado } from '../../Modelos/Entity/Empleado';
import { EstadoEmpleado } from '../../Modelos/Enums/EstadoEmpleado';
import { TerapeutaService } from '../../Servicios/Service/terapeuta.service';
import { TerapeutaDisponibilidad } from '../../Modelos/Entity/TerapeutaDisponibilidad';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-disponibilidad',
  imports: [CommonModule, RouterModule, FormsModule],
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
  modalAbierto = false;
  modoEdicion = false;
  disponibilidades: TerapeutaDisponibilidad[] = [];

  constructor(private usuarioService: UsuarioService,
    private router: Router,
    private terapeutaService: TerapeutaService,
    private toastr: ToastrService
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

      // Cargar disponibilidades después de los terapeutas
      this.terapeutaService.listarTodas().subscribe({
        next: (disponibilidades: TerapeutaDisponibilidad[]) => {
          this.disponibilidades = disponibilidades;
        },
        error: (err) => {
          console.error('Error al cargar disponibilidades:', err);
        }
      });
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

  disponibilidadSeleccionada: TerapeutaDisponibilidad = {
  empleadoId: 0,
  diaSemana: '',
  horaInicio: '',
  horaFin: ''
};

abrirModalCrear(terapeuta: Empleado): void {
  this.modoEdicion = false;
  this.disponibilidadSeleccionada = {
    empleadoId: terapeuta.idUsuario,
    diaSemana: '',
    horaInicio: '',
    horaFin: ''
  };
  this.modalAbierto = true;
}

abrirModalEditar(terapeuta: Empleado): void {
  this.modoEdicion = true;
  this.disponibilidadSeleccionada = {
    empleadoId: terapeuta.idUsuario,
    diaSemana: 'Lunes', // puedes cargar datos reales si los tienes
    horaInicio: '08:00',
    horaFin: '10:00'
  };
  this.modalAbierto = true;
}

cerrarModal(): void {
  this.modalAbierto = false;
}

guardarOActualizarDisponibilidad() {
  if (this.modoEdicion && this.disponibilidadSeleccionada.id) {
    this.terapeutaService.actualizarDisponibilidad(this.disponibilidadSeleccionada.id, this.disponibilidadSeleccionada)
      .subscribe(() => {
        this.toastr.info('Disponibilidad actualizada exitosamente.', 'Éxito');
        this.cargarTerapeutas();
        this.modalAbierto = false;
      });
  } else {
    this.terapeutaService.guardarDisponibilidad(this.disponibilidadSeleccionada)
  .subscribe({
    next: (mensaje: string) => {
      this.toastr.success(mensaje || 'Disponibilidad registrada con éxito.', 'Éxito');
      this.cargarTerapeutas();
      this.modalAbierto = false;
    },
    error: (err) => {
      this.toastr.error('Error al guardar disponibilidad', 'Error');
      alert('Error al guardar disponibilidad');
    }
  });
  }
}

obtenerDisponibilidadPorDia(idUsuario: number, dia: string): string {
  const disponibilidadesDia = this.disponibilidades.filter(d =>
    d.empleado?.idUsuario === idUsuario && d.diaSemana === dia
  );

  if (disponibilidadesDia.length === 0) {
    return '-';
  }

  // Ejemplo: "08:00 - 10:00 | 14:00 - 16:00"
  return disponibilidadesDia
    .map(d => `${d.horaInicio.slice(0, 5)} - ${d.horaFin.slice(0, 5)}`)
    .join(' | ');
}

editarFranja(disp: TerapeutaDisponibilidad): void {
  this.modoEdicion = true;
  this.disponibilidadSeleccionada = {
    id: disp.id,
    empleadoId: disp.empleado?.idUsuario || 0,
    diaSemana: disp.diaSemana,
    horaInicio: disp.horaInicio,
    horaFin: disp.horaFin
  };
  this.modalAbierto = true;
}

eliminarFranja(id: number): void {
  if (confirm('¿Deseas eliminar esta franja de disponibilidad?')) {
    this.terapeutaService.eliminarDisponibilidad(id).subscribe(() => {
      this.toastr.error('Franja de disponibilidad eliminada.', 'Eliminado');
      this.cargarTerapeutas();
    });
  }
}

obtenerDisponibilidadesPorDia(idUsuario: number, dia: string): TerapeutaDisponibilidad[] {
  return this.disponibilidades.filter(d =>
    d.empleado?.idUsuario === idUsuario && d.diaSemana === dia
  );
}

}
