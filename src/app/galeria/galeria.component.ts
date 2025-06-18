import { Component, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { Autoplay, FreeMode } from 'swiper/modules';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    Swiper.use([Autoplay, FreeMode]);

    const swiper = new Swiper('.galeriaSwiper', {
      loop: true,
      slidesPerView: 'auto',
      spaceBetween: 20,
      freeMode: true,
      speed: 3000, // controla la velocidad del scroll continuo
      autoplay: {
        delay: 1, // ¡esto es la clave!
        disableOnInteraction: false,
      },
      allowTouchMove: true, // permite que el usuario lo frene si quiere
      grabCursor: true
    });
  }
}
