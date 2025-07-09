import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../Servicios/Service/usuario.service';
import { SesionService } from '../../Servicios/Service/sesion.service';
import { tipoSesionService } from '../../Servicios/Service/tipo-sesion.service';
import { PacienteService } from '../../Servicios/Service/paciente.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MercadoPagoService } from '../../Servicios/Service/mercado-pago.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pago',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css'
})
export class PagoComponent {
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
    
    
  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private sesionService: SesionService,
    private tipoSesionService: tipoSesionService,
    private pacienteService: PacienteService,
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
}

