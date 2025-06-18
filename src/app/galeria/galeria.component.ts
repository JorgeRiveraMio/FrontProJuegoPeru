import { Component, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    Swiper.use([Autoplay]);

    const swiper = new Swiper('.galeriaSwiper', {
      loop: true,
      slidesPerView: 'auto', // usa ancho automático para deslizar suave
      spaceBetween: 20,
      speed: 4000, // velocidad de animación (ms)
      freeMode: true, // activa modo libre
      autoplay: {
        delay: 0, // sin pausa entre movimientos
        disableOnInteraction: false,
      },
      grabCursor: true,
    });
  }

}
