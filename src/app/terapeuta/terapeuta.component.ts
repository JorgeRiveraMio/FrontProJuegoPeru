import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../Servicios/Service/usuario.service';
import { UsuarioActual } from '../../Modelos/Entity/UsuarioActual';
import { EstadoEmpleado } from '../../Modelos/Enums/EstadoEmpleado';

@Component({
  selector: 'app-terapeuta',
  imports: [CommonModule, RouterModule],
  templateUrl: './terapeuta.component.html',
  styleUrl: './terapeuta.component.css'
})
export class TerapeutaComponent {

  isCollapsed = false;
  rolUsuario: string = '';
  nombreUsuario: string = '';
  idRol: number = 0;
  terapeutas: UsuarioActual[] = [];
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
        t.rol?.id === 3 && t.estadoEmpleado === 'ACTIVO'
        
      );
      console.log('Terapeutas recibidos:', data);
    },
    error: (err) => console.error('Error al cargar terapeutas:', err)
  });
}

//boton para crear un nuevo terapeuta
nuevo(){

}

editar(){

}

eliminar(){

}

}
