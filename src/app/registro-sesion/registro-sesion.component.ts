import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../Servicios/Service/usuario.service';
import { SesionService } from '../../Servicios/Service/sesion.service';
import { tipoSesionService } from '../../Servicios/Service/tipo-sesion.service';
import { PacienteService } from '../../Servicios/Service/paciente.service';
import { ToastrService } from 'ngx-toastr';
import { UsuarioActual } from '../../Modelos/Entity/UsuarioActual';

@Component({
  selector: 'app-registro-sesion',
  imports: [CommonModule,ReactiveFormsModule, RouterModule],
  templateUrl: './registro-sesion.component.html',
  styleUrl: './registro-sesion.component.css'
})
export class RegistroSesionComponent {
  isCollapsed = false;
  nombreUsuario: string = '';
  rolUsuario: string = '';
  idUsuario: number = 0;
  pacientes: any[] = [];
  sesionesPorPaciente: { paciente: any, sesiones: any[] }[] = [];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private sesionService: SesionService,
    private tipoSesionService: tipoSesionService,
    private pacienteService: PacienteService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
  this.usuarioService.obtenerUsuarioActual().subscribe({
    next: (usuario: UsuarioActual) => {
      this.nombreUsuario = usuario.name || usuario.username || 'Usuario';
      this.idUsuario = usuario.idUsuario;
      this.rolUsuario = this.obtenerRol(usuario.idRol);

      if (this.rolUsuario === 'ROLE_TUTOR') {
        this.obtenerPacientesYTerapias(); // ya lo tienes
      } else if (this.rolUsuario === 'ROLE_ADMIN') {
        this.obtenerTodasLasSesiones(); // 👈 NUEVO
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

  obtenerPacientesYTerapias(): void {
    this.pacienteService.obtenerPacientesPorTutor(this.idUsuario).subscribe({
      next: (pacientes) => {
        this.pacientes = pacientes;
        this.cargarSesionesPorPacientes();
      },
      error: (err) => {
        console.error('Error al obtener pacientes del tutor:', err);
        this.toastr.error('Error al cargar pacientes del tutor');
      }
    });
  }

  obtenerTodasLasSesiones(): void {
  this.sesionService.obtenerTodasLasSesiones().subscribe({
    next: (sesiones) => {
      this.sesionesPorPaciente = [];

      const agrupado = new Map<number, { paciente: any, sesiones: any[] }>();

      sesiones.forEach(sesion => {
        const paciente: any = sesion.paciente; 

        const pacienteId = paciente.id ?? paciente.idPaciente;
        if (!pacienteId) return;

        if (!agrupado.has(pacienteId)) {
          agrupado.set(pacienteId, {
            paciente: paciente,
            sesiones: []
          });
        }

        agrupado.get(pacienteId)?.sesiones.push(sesion);
      });

      this.sesionesPorPaciente = Array.from(agrupado.values());
    },
    error: (err) => {
      console.error('Error al obtener todas las sesiones:', err);
      this.toastr.error('Error al cargar sesiones');
    }
  });
}

  cargarSesionesPorPacientes(): void {
    this.sesionesPorPaciente = [];

    this.pacientes.forEach((paciente) => {
      this.sesionService.obtenerSesionesPorPaciente(paciente.id).subscribe({
        next: (sesiones) => {
          this.sesionesPorPaciente.push({ paciente, sesiones });
        },
        error: (err) => {
          console.error(`Error al obtener sesiones para el paciente ${paciente.id}:`, err);
        }
      });
    });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  cerrarSesion(): void {
    this.usuarioService.logout();
    this.router.navigate(['/']);
  }

}
