import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../Servicios/Service/usuario.service';
import { SesionService } from '../../Servicios/Service/sesion.service';
import { tipoSesionService } from '../../Servicios/Service/tipo-sesion.service';
import { PacienteService } from '../../Servicios/Service/paciente.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MercadoPagoService } from '../../Servicios/Service/mercado-pago.service';
import { CommonModule } from '@angular/common';
import { UsuarioActual } from '../../Modelos/Entity/UsuarioActual';

@Component({
  selector: 'app-pago',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css'
})
export class PagoComponent implements OnInit {
    isCollapsed = false;
    nombreUsuario: string = '';
    rolUsuario: string = '';
    idUsuario: number = 0;
    minDate: string = '';
    formularioSesion!: FormGroup;
    pacientes: any[] = [];
    terapeutas: any[] = [];
    tiposSesion: any[] = [];
    horasDisponibles: string[] = [];
    
   ngOnInit(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = this.formatDateToInput(tomorrow);
   

    this.usuarioService.obtenerUsuarioActual().subscribe({
      next: (usuario: UsuarioActual) => {
        this.nombreUsuario = usuario.name || usuario.username || 'Usuario';
        this.idUsuario = usuario.idUsuario;
        this.rolUsuario = this.obtenerRol(usuario.idRol);
        
      },
      error: () => {
        this.nombreUsuario = 'Usuario';
        this.rolUsuario = '';
      }
    });
   
  } 
  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,   
    private router: Router,
    private toastr: ToastrService,
    private pagoService: MercadoPagoService // Asegúrate de importar el servicio de pago
  ) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  cerrarSesion(): void {
    this.usuarioService.logout();
    this.router.navigate(['/']);
  }
    obtenerRol(idRol: number): string {
    switch (idRol) {
      case 1: return 'ROLE_TUTOR';
      case 2: return 'ROLE_ADMIN';
      case 3: return 'ROLE_TERAPEUTA';
      default: return '';
    }
  }
   formatDateToInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}

