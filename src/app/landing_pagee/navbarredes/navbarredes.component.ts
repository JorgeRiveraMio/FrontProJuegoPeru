import { Component } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-navbarredes',
  standalone: true,
  imports: [],
  templateUrl: './navbarredes.component.html',
  styleUrls: ['./navbarredes.component.css']
})
export class NavbarredesComponent {
  constructor(private viewportScroller: ViewportScroller) {}

  scrollTo(section: string) {
    this.viewportScroller.scrollToAnchor(section);
  }
}
