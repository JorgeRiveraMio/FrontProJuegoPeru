import { Component } from '@angular/core';
import { UsuarioActual } from '../../Modelos/Entity/UsuarioActual';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../Servicios/Service/usuario.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TerapeutaDisponibilidad } from '../../Modelos/Entity/TerapeutaDisponibilidad';
import { TerapeutaService } from '../../Servicios/Service/terapeuta.service';

@Component({
  selector: 'app-disponibilidad-terapeuta',
  imports: [CommonModule,ReactiveFormsModule, RouterModule],
  templateUrl: './disponibilidad-terapeuta.component.html',
  styleUrl: './disponibilidad-terapeuta.component.css'
})
export class DisponibilidadTerapeutaComponent {

  isCollapsed = false;
  nombreUsuario: string = '';
  rolUsuario: string = '';
  idUsuario: number = 0;
  disponibilidad: TerapeutaDisponibilidad[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private terapeutaService: TerapeutaService
  ) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  
  ngOnInit(): void {
    this.usuarioService.obtenerUsuarioActual().subscribe({
      next: (usuario: UsuarioActual) => {
        this.nombreUsuario = usuario.name || usuario.username || 'Usuario';
        this.idUsuario = usuario.idUsuario;

        // Detectar rol
        this.rolUsuario = this.obtenerRol(usuario.idRol);

        // Solo si es terapeuta, carga su disponibilidad
        if (this.rolUsuario === 'ROLE_TERAPEUTA') {
          this.cargarDisponibilidad(this.idUsuario);
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

  cargarDisponibilidad(idEmpleado: number): void {
  this.terapeutaService.obtenerDisponibilidadPorEmpleado(idEmpleado).subscribe({
    next: (data) => {
      const ordenSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
      this.disponibilidad = data.sort((a, b) => {
        return ordenSemana.indexOf(a.diaSemana) - ordenSemana.indexOf(b.diaSemana);
      });
      console.log('Disponibilidad ordenada:', this.disponibilidad);
    },
    error: () => {
      console.error('Error al cargar la disponibilidad');
    }
  });
}


  cerrarSesion(): void {
    this.usuarioService.logout();
    this.router.navigate(['/']);
  }
}
