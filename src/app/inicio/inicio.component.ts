import { Component, HostListener } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { NavbarredesComponent } from '../navbarredes/navbarredes.component';
import { ServiciosComponent } from '../servicios/servicios.component';
import { SedesComponent } from '../sedes/sedes.component';
import { MaterialesComponent } from '../materiales/materiales.component';
import { ContactoComponent } from '../contacto/contacto.component';
import { Router } from '@angular/router';
import { GaleriaComponent } from '../galeria/galeria.component';
import { TestimoniosComponent } from '../testimonios/testimonios.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [NavbarComponent, NavbarredesComponent, ServiciosComponent, SedesComponent, MaterialesComponent, ContactoComponent, GaleriaComponent, TestimoniosComponent],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  constructor(private router: Router) {}
  title = 'Pro Juego';
  ngOnInit(): void {
    const btn = document.getElementById("btnSubir");
    if (btn) {
      btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const btn = document.getElementById("btnSubir");
    if (btn) {
      btn.style.display = (window.scrollY > 50) ? 'block' : 'none';
    }
  }

  iniciaSesion() {
    this.router.navigate(['/login']);
  }

}
