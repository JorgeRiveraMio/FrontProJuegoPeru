import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../Servicios/Service/usuario.service';
import { UsuarioActual } from '../../Modelos/Entity/UsuarioActual';
import { tipoSesionService } from '../../Servicios/Service/tipo-sesion.service';
import { PacienteService } from '../../Servicios/Service/paciente.service';
import { SesionService } from '../../Servicios/Service/sesion.service';
import { ToastrService } from 'ngx-toastr';
import { TerapeutaDisponibilidad } from '../../Modelos/Entity/TerapeutaDisponibilidad';

@Component({
  selector: 'app-sesion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './sesion.component.html',
  styleUrl: './sesion.component.css'
})
export class SesionComponent implements OnInit {

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
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = this.formatDateToInput(tomorrow); // ✅ ZONA HORARIA LOCAL

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

    // Listeners para actualizar horas disponibles
    this.formularioSesion.get('empleadoTerapeutaId')?.valueChanges.subscribe(() => {
      this.validarDisponibilidad();
    });
    this.formularioSesion.get('fechaSesion')?.valueChanges.subscribe(() => {
      this.validarDisponibilidad();
    });
  }

  formatDateToInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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

  validarDisponibilidad() {
    const terapeutaId = this.formularioSesion.get('empleadoTerapeutaId')?.value;
    const fecha = this.formularioSesion.get('fechaSesion')?.value;

    if (!terapeutaId || !fecha) {
      this.horasDisponibles = [];
      return;
    }

    const diaSemana = this.obtenerDiaSemana(fecha);

    this.sesionService.obtenerDisponibilidadPorTerapeuta(terapeutaId).subscribe({
      next: (disponibilidades: TerapeutaDisponibilidad[]) => {
        const franjas = disponibilidades.filter(d => d.diaSemana === diaSemana);
        this.horasDisponibles = this.generarHorasDesdeFranjas(franjas);
      },
      error: () => {
        this.horasDisponibles = [];
      }
    });
  }

  obtenerDiaSemana(fechaStr: string): string {
    const [year, month, day] = fechaStr.split('-').map(Number);
    const fechaLocal = new Date(year, month - 1, day);
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[fechaLocal.getDay()];
  }



  generarHorasDesdeFranjas(franjas: TerapeutaDisponibilidad[]): string[] {
    const horas: string[] = [];

    franjas.forEach(franja => {
      const start = new Date(`1970-01-01T${franja.horaInicio}`);
      const end = new Date(`1970-01-01T${franja.horaFin}`);

      while (start < end) {
        horas.push(start.toTimeString().substring(0, 5)); // HH:mm
        start.setMinutes(start.getMinutes() + 30);
      }
    });

    return horas;
  }

  guardarSesion(): void {
    const formValue = this.formularioSesion.value;
    const hora = formValue.hora;
    const fecha = formValue.fechaSesion;

    if (!hora || !fecha || this.horasDisponibles.length === 0) {
      alert('Selecciona una hora válida disponible.');
      return;
    }

    const fechaHoy = new Date();
    const fechaSeleccionada = new Date(fecha);
    fechaHoy.setHours(0, 0, 0, 0);
    fechaSeleccionada.setHours(0, 0, 0, 0);

    if (fechaSeleccionada <= fechaHoy) {
      alert('La fecha debe ser posterior al día actual.');
      return;
    }

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
      next: () => {
        this.toastr.success('Sesión creada exitosamente', 'Éxito');
        this.formularioSesion.reset();
        this.horasDisponibles = [];
      },
      error: () => {
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
