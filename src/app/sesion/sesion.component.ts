import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../Servicios/Service/usuario.service';
import { UsuarioActual } from '../../Modelos/Entity/UsuarioActual';
import { tipoSesionService } from '../../Servicios/Service/tipo-sesion.service';
import { PacienteService } from '../../Servicios/Service/paciente.service';
import { SesionService } from '../../Servicios/Service/sesion.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sesion',
  imports: [CommonModule,ReactiveFormsModule, RouterModule],
  templateUrl: './sesion.component.html',
  styleUrl: './sesion.component.css'
})
export class SesionComponent {

  isCollapsed = false;
  nombreUsuario: string = '';
  rolUsuario: string = '';
  idUsuario: number = 0;

  formularioSesion!: FormGroup;
  pacientes: any[] = [];
  terapeutas: any[] = [];
  tiposSesion: any[] = [];

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
    this.formularioSesion = this.fb.group({
      pacienteId: ['', Validators.required],
      empleadoTerapeutaId: ['', Validators.required],
      tipoSesionId: ['', Validators.required],
      fechaSesion: ['', Validators.required],
      hora: ['', Validators.required],
      empleadoAdminId: [null],
      estado: ['PROGRAMADA'],
      fechaRegistro: new Date().toISOString()
    });

    this.usuarioService.obtenerUsuarioActual().subscribe({
      next: (usuario: UsuarioActual) => {
        this.nombreUsuario = usuario.name || usuario.username || 'Usuario';
        this.idUsuario = usuario.idUsuario;
        this.rolUsuario = this.obtenerRol(usuario.idRol);
        this.cargarDatos();
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

  cargarDatos() {
  this.tipoSesionService.listarTodos().subscribe(data => this.tiposSesion = data);
  this.usuarioService.ListarTerapeutas().subscribe(data => this.terapeutas = data);

    if (this.rolUsuario === 'ROLE_ADMIN') {
      this.pacienteService.obtenerTodosLosPacientes().subscribe(data => this.pacientes = data);
    } else if (this.rolUsuario === 'ROLE_TUTOR') {
      this.pacienteService.obtenerPacientesPorTutor(this.idUsuario).subscribe(data => this.pacientes = data);
    }
  }

  guardarSesion(): void {
  const formValue = this.formularioSesion.value;

  const sesionDto = {
    pacienteId: Number(formValue.pacienteId),
    empleadoTerapeutaId: Number(formValue.empleadoTerapeutaId),
    tipoSesionId: Number(formValue.tipoSesionId),
    fechaSesion: formValue.fechaSesion,
    hora: formValue.hora,
    empleadoAdminId: this.rolUsuario === 'ROLE_ADMIN' ? this.idUsuario : null,
    estado: 'PROGRAMADA',
    fechaRegistro: new Date().toISOString()
  };

  this.sesionService.reservarSesion(sesionDto).subscribe({
    next: (res) => {
      this.toastr.success('Sesión creada exitosamente', 'Éxito');
      this.formularioSesion.reset();
    },
    error: (err) => {
      this.toastr.error('Error al crear la sesión', 'Error');
    }
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
