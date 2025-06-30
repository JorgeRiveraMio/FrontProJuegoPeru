import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../Servicios/Service/usuario.service';
import { UsuarioActual } from '../../Modelos/Entity/UsuarioActual';

@Component({
  selector: 'app-inicio-principal',
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio-principal.component.html',
  styleUrl: './inicio-principal.component.css'
})
export class InicioPrincipalComponent {

  isCollapsed = false;
  nombreUsuario: string = '';
  rolUsuario: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  
  ngOnInit(): void {
    this.usuarioService.obtenerUsuarioActual().subscribe({
      next: (usuario: UsuarioActual) => {
        this.nombreUsuario = usuario.name || usuario.username || 'Usuario';
        
        // Detectar rol según idRol (ajusta números a los de tu backend)
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
      },
      error: () => {
        this.nombreUsuario = 'Usuario';
        this.rolUsuario = '';
      }
    });
  }

  cerrarSesion(): void {
    this.usuarioService.logout();
    this.router.navigate(['/']);
  }

  // Métodos de navegación
  irRegistrarCita() {
    this.router.navigate(['/registrar-cita']);
  }

  irCitasGeneradas() {
    this.router.navigate(['/citas-generadas']);
  }

  irRecetas() {
    this.router.navigate(['/recetas']);
  }

  irTutelados() {
    this.router.navigate(['/tutelados']);
  }

  irDisponibilidad() {
    this.router.navigate(['/disponibilidad']);
  }

  irDisponibilidadTerapeuta() {
    this.router.navigate(['/disponibilidad-terapeuta']);
  }
}
