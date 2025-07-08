import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../Servicios/Service/usuario.service';
import { UsuarioActual } from '../../Modelos/Entity/UsuarioActual';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Paciente, PacienteRegistro } from '../../Modelos/Entity/Paciente';
import { PacienteService } from '../../Servicios/Service/paciente.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tutelados',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './tutelados.component.html',
  styleUrl: './tutelados.component.css'
})
export class TuteladosComponent implements OnInit {
  isCollapsed = false;
  nombreUsuario: string = '';
  rolUsuario: string = '';
  TuteladosForm!: FormGroup;
  IdEncargado: number = 0;
  cargando = true;
  tutelados: Paciente[] = [];
  tutores: any[] = [];
  mostrarFormularioRegistro: boolean = false;
  tuteladoEditar: Paciente | null = null;
  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private pacienteService: PacienteService,
    private tutorService: UsuarioService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarUsuario();
    this.initializeForm();
  }

  // Método para obtener los datos del usuario
  cargarUsuario(): void {
    this.cargando = true;
    this.usuarioService.obtenerUsuarioActual().subscribe({
      next: (usuario: UsuarioActual) => {
        this.nombreUsuario = usuario.name || usuario.username || 'Usuario';
        this.rolUsuario = this.obtenerRolUsuario(usuario.idRol);
        this.IdEncargado = usuario.idUsuario;       
       this.obtenerPacientes();
       if (this.rolUsuario === 'ROLE_ADMIN') {
        this.obtenerTutores();
      }
    },
      error: () => {
        this.nombreUsuario = 'Usuario';
        this.rolUsuario = '';
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

  obtenerTutores(): void {
    this.tutorService.obtenerTutores().subscribe({
      next: (tutores) => {
        this.tutores = tutores;  // Almacenar los tutores en la variable 'tutores'
      },
      error: (error) => {
        console.error('Error al obtener los tutores', error);
      }
    });
  }

  // Método para inicializar el formulario
  initializeForm(): void {
  if (this.rolUsuario === 'ROLE_ADMIN') {
    // Si es Admin, el campo "tutor" será obligatorio
    this.TuteladosForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern('\\d{8}')]],
      fechaNacimiento: ['', Validators.required],
      Sexo: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      escuela: ['', Validators.required],
      grado: ['', Validators.required],
      tutor: ['', Validators.required]  // El tutor es obligatorio solo para Admin
    });
  } else {
    // Si es Tutor, el campo "tutor" no se incluye en la validación
    this.TuteladosForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern('\\d{8}')]],
      fechaNacimiento: ['', Validators.required],
      Sexo: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      escuela: ['', Validators.required],
      grado: ['', Validators.required],
      tutor: ['']  // El campo tutor no es obligatorio para el Tutor
    });
  }
}

  obtenerPacientes(): void {
  if (this.rolUsuario === 'ROLE_TUTOR') {
    this.pacienteService.obtenerPacientesPorTutor(this.IdEncargado).subscribe({
      next: (pacientes) => {
        this.tutelados = pacientes;  // Almacenar los pacientes en la variable 'tutelados'
        this.cargando = false;  // Detener la carga
      },
      error: (error) => {
        console.error('Error al obtener los pacientes', error);
        this.cargando = false;
      }
    });
  } else if (this.rolUsuario === 'ROLE_ADMIN') {
    // Si el usuario es un administrador, mostrar todos los pacientes
    this.pacienteService.obtenerTodosLosPacientes().subscribe({
      next: (pacientes) => {
        this.tutelados = pacientes;  // Almacenar todos los pacientes
        this.cargando = false;  // Detener la carga
      },
      error: (error) => {
        console.error('Error al obtener todos los pacientes', error);
        this.cargando = false;
      }
    });
  }
}

  // Método para manejar el cierre de sesión
  cerrarSesion(): void {
    this.usuarioService.logout();
    this.router.navigate(['/']);
  }

  // Método para manejar la acción de guardar paciente
  guardar(): void {
  if (this.TuteladosForm.invalid) {
    return;
  }

  const pacienteDetalles: Paciente = this.crearPaciente();  // Creamos el objeto paciente

  // Si estamos en modo de edición, llamamos al método de actualización
  if (this.tuteladoEditar) {
    // Llamar al método de actualización de paciente
    this.pacienteService.actualizarPaciente(pacienteDetalles.dni, pacienteDetalles).subscribe({
      next: (response) => {
        this.toastr.success('Paciente actualizado correctamente.', 'Éxito');
        this.cerrarFormulario();  // Cerrar el formulario después de la actualización
        this.obtenerPacientes();  // Recargar la lista de pacientes
      },
      error: (error) => {
        console.error('Error al actualizar el paciente:', error);
        this.toastr.error('Error al actualizar el paciente. Intente nuevamente.', 'Error');
      }
    });
  } else {
    // Si estamos en modo de creación, llamamos al método de registro
    this.pacienteService.registrarPaciente(pacienteDetalles).subscribe({
      next: (response) => {
        this.toastr.success('Paciente registrado correctamente.', 'Éxito');
        this.cerrarFormulario();  // Cerrar el formulario después de la creación
        this.obtenerPacientes();  // Recargar la lista de pacientes
        this.router.navigate(['/informe-evaluacion'], { queryParams: { pacienteId: response.id } });
      },
      error: (error) => {
        console.error('Error al registrar paciente:', error);
        this.toastr.error('Error al registrar el paciente. Intente nuevamente.', 'Error');
      }
    });
  }
}

 crearPaciente(): PacienteRegistro {
  const tutorId = (this.rolUsuario === 'ROLE_ADMIN' && this.tuteladoEditar)
    ? this.tuteladoEditar.tutor?.idUsuario
    : (this.rolUsuario === 'ROLE_ADMIN'
        ? parseInt(this.TuteladosForm.get('tutor')?.value)
        : this.IdEncargado);

  return {
    nombre: this.TuteladosForm.value.name,
    apellido: this.TuteladosForm.value.lastname,
    fechaNacimiento: this.TuteladosForm.value.fechaNacimiento,
    sexo: this.TuteladosForm.value.Sexo === 'M' ? 0 : 1,
    dni: this.TuteladosForm.value.dni,
    direccion: this.TuteladosForm.value.direccion,
    telefono: this.TuteladosForm.value.telefono,
    escuela: this.TuteladosForm.value.escuela,
    gradoEscolar: this.TuteladosForm.value.grado,
    tutor: {
      idUsuario: tutorId
    }
  };
}

editar(nino: Paciente): void {
  this.tuteladoEditar = nino;

  this.TuteladosForm.patchValue({
    name: nino.nombre,
    lastname: nino.apellido,
    dni: nino.dni,
    fechaNacimiento: nino.fechaNacimiento,
    Sexo: nino.sexo === 0 ? 'M' : 'F',
    direccion: nino.direccion,
    telefono: nino.telefono,
    escuela: nino.escuela,
    grado: nino.gradoEscolar,
    tutor: nino.tutor?.idUsuario || ''
  });

  if (this.rolUsuario === 'ROLE_ADMIN') {
    this.TuteladosForm.get('tutor')?.disable();
  }

  this.mostrarFormularioRegistro = true;
}


  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  mostrarFormulario(): void {
    this.mostrarFormularioRegistro = true;
    this.tuteladoEditar = null;
    this.TuteladosForm.reset();

    if (this.rolUsuario === 'ROLE_ADMIN') {
      this.TuteladosForm.get('tutor')?.enable();
    }
  }
  // Método para cerrar el formulario de registro
  cerrarFormulario(): void {
    this.mostrarFormularioRegistro = false;
    this.TuteladosForm.reset();
  }

  verInformes(id?: number): void {
    if (!id) {
      this.toastr.warning('ID de paciente no válido');
      return;
    }
    this.router.navigate(['/informe-evaluacion'], { queryParams: { pacienteId: id } });
  }

}
