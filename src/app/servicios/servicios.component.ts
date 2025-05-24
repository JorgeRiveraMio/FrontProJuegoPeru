import { Component, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-servicios',
  imports: [],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    const titulo = this.elementRef.nativeElement.querySelector(".tituloo");

    const visualizar = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          titulo.classList.add("visible");
        }
      });
    },{
      threshold: 0.5
    });
    if (titulo) {
      visualizar.observe(titulo);
    }
  }
}
