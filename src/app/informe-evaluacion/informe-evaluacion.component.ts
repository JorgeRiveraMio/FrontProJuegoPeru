import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InformeEvaluacionService } from '../../Servicios/Service/informe-evaluacion.service';
import { PacienteService } from '../../Servicios/Service/paciente.service';
import { UsuarioService } from '../../Servicios/Service/usuario.service';
import { UsuarioActual } from '../../Modelos/Entity/UsuarioActual';

declare var cloudinary: any;

@Component({
  selector: 'app-informe-evaluacion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './informe-evaluacion.component.html',
  styleUrls: ['./informe-evaluacion.component.css']
})
export class InformeEvaluacionComponent implements OnInit {
  pacienteId: number | null = null;
  fechaUltimaTerapia: string = '';
  observaciones: string = '';
  comentario: string = '';
  nombreUsuario: string = '';
  pdfUrl: string = '';
  informes: any[] = [];
  pacientes: any[] = [];
  soloLectura: boolean = false;
  rolUsuario: string = '';
  idUsuario: number = 0;
  idRol: number = 0;
  isCollapsed = false;
  cargando: boolean = true;

  constructor(
    private informeService: InformeEvaluacionService,
    private pacienteService: PacienteService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
  private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Leer parámetro pacienteId desde la URL
    this.route.queryParams.subscribe(params => {
      const pacienteIdParam = params['pacienteId'];

      if (pacienteIdParam && !isNaN(+pacienteIdParam)) {
        this.pacienteId = +pacienteIdParam;
        // this.soloLectura = true; // Desactívalo para pruebas
        this.informeService.obtenerPorPaciente(this.pacienteId).subscribe({
          next: data => this.informes = data,
          error: () => alert('Error al cargar informes del paciente')
        });
      } else {
        this.informeService.obtenerTodos().subscribe({
          next: data => this.informes = data,
          error: () => alert('Error al cargar todos los informes')
        });
      }
    });

    // Obtener usuario actual
    this.usuarioService.obtenerUsuarioActual().subscribe({
      next: (usuario: UsuarioActual) => {
        this.nombreUsuario = usuario.name || usuario.username || 'Usuario';
        this.idUsuario = usuario.idUsuario || 0;
        this.idRol = usuario.idRol;

        switch (usuario.idRol) {
          case 1: this.rolUsuario = 'ROLE_TUTOR'; break;
          case 2: this.rolUsuario = 'ROLE_ADMIN'; break;
          case 3: this.rolUsuario = 'ROLE_TERAPEUTA'; break;
          default: this.rolUsuario = '';
        }

        if (this.rolUsuario === 'ROLE_TUTOR') {
          this.pacienteService.obtenerPacientesPorTutor(this.idUsuario).subscribe({
            next: (pacientes) => {
              console.log('Pacientes recibidos:', pacientes);
              this.pacientes = pacientes;
            },
            error: () => alert('Error al cargar pacientes del tutor')
          });
        } else {
          this.pacienteService.obtenerTodosLosPacientes().subscribe({
            next: (pacientes) => {
              console.log('Pacientes recibidos:', pacientes);
              this.pacientes = pacientes;
            },
            error: () => alert('Error al cargar todos los pacientes')
          });
        }

        this.cargando = false;
      },
      error: () => {
        this.nombreUsuario = 'Usuario';
        this.rolUsuario = '';
        this.cargando = false;
        alert('No se pudo obtener el usuario actual');
      }
    });
  }

  abrirWidget(): void {
    const widget = cloudinary.createUploadWidget({
      cloudName: 'dx3fdu2nw',
      uploadPreset: 'pdf_preset',
      sources: ['local', 'url'],
      resourceType: 'raw',
      multiple: false,
      maxFileSize: 10000000,
      clientAllowedFormats: ['pdf']
    }, (error: any, result: any) => {
      if (!error && result && result.event === 'success') {
        this.pdfUrl = result.info.secure_url;
        alert('PDF subido exitosamente a Cloudinary');
      }
    });

    widget.open();
  }

  subirInforme(): void {
    console.log('pacienteId:', this.pacienteId);
    console.log('fechaUltimaTerapia:', this.fechaUltimaTerapia);
    console.log('pdfUrl:', this.pdfUrl);

    if (!this.pdfUrl || !this.fechaUltimaTerapia || this.pacienteId === null) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    const dto = {
      pacienteId: this.pacienteId,
      fechaUltimaTerapia: this.fechaUltimaTerapia,
      observaciones: this.observaciones,
      urlArchivo: this.pdfUrl
    };

    console.log('DTO a enviar:', dto);

    const formData = new FormData();
    formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

    this.informeService.guardarInforme(formData).subscribe({
      next: () => {
        alert('Informe guardado exitosamente');
        this.pdfUrl = '';
        this.fechaUltimaTerapia = '';
        this.observaciones = '';
        this.pacienteId = null;
        this.ngOnInit();
      },
      error: () => alert('Error al guardar el informe')
    });
  }

  verPdf(url: string): void {
    window.open(url, '_blank');
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
  aprobarInforme(informeId: number): void {
        this.informeService.aprobarInforme(informeId).subscribe({
      next: (res) => {
         this.toastr.success('Informe aprobado con éxito ✅', 'Aprobado');
         this.informeService.obtenerTodos().subscribe({
          next: data => this.informes = data,
          error: () => alert('Error al cargar todos los informes')
        });
       
      },
      error: (err) => {
        console.error('Error al aprobar', err);
      }
    });

  }
  desaprobarInforme(informeId: number): void {
  this.informeService.desaprobarInforme(informeId).subscribe({
        next: (res) => {
          this.toastr.success('Informe desaprobado con éxito ✅', 'Aprobado');
          this.informeService.obtenerTodos().subscribe({
            next: data => this.informes = data,
            error: () => alert('Error al cargar todos los informes')
          });
        
        },
        error: (err) => {
          console.error('Error al aprobar', err);
        }
      });
  }
    enviarComentario(informeId: number): void {
      this.informeService.actualizarComentario(informeId, this.comentario).subscribe({
    next: () => this.toastr.success('Comentario actualizado'),
    error: () => this.toastr.error('Error al actualizar comentario')
  });

  }
  cerrarSesion(): void {
    this.usuarioService.logout();
    this.router.navigate(['/']);
  }
}
