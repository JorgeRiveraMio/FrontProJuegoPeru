import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Pago } from '../../Modelos/Entity/Pago';
import { MercadoPagoService } from '../../Servicios/Service/mercado-pago.service';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../Servicios/Service/usuario.service';
import { UsuarioActual } from '../../Modelos/Entity/UsuarioActual';

@Component({
  selector: 'app-pagos-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './pagos-list.component.html',
  styleUrls: ['./pagos-list.component.css']
})
export class PagosListComponent implements OnInit {
  isCollapsed = false;
  nombreUsuario: string = '';
  rolUsuario: string = '';
  pagos: Pago[] = [];
  pago?: Pago;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,  
    private router: Router, 
    private mercadoPagoService: MercadoPagoService
  ) {}

  ngOnInit(): void {
    this.usuarioService.obtenerUsuarioActual().subscribe({
      next: (usuario: UsuarioActual) => {
        this.nombreUsuario = usuario.name || usuario.username || 'Usuario';
        this.rolUsuario = this.obtenerRol(usuario.idRol);
      },
      error: () => {
        this.nombreUsuario = 'Usuario';
        this.rolUsuario = '';
      }
    });

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const id = Number(idParam);
      if (isNaN(id)) {
        this.error = 'ID inválido';
        this.loading = false;
        return;
      }

      this.mercadoPagoService.getPagoById(id).subscribe({
        next: (data) => {
          this.pago = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'No se pudo cargar el pago';
          this.loading = false;
        }
      });
    } else {
      this.mercadoPagoService.getAllPagos().subscribe({
        next: (data) => {
          this.pagos = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'No se pudieron cargar los pagos';
          this.loading = false;
        }
      });
    }
  }

  obtenerRol(idRol: number): string {
    switch (idRol) {
      case 1: return 'ROLE_TUTOR';
      case 2: return 'ROLE_ADMIN';
      case 3: return 'ROLE_TERAPEUTA';
      default: return '';
    }
  }
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  cerrarSesion(): void {
    this.usuarioService.logout();
    this.router.navigate(['/']);
  }
}
