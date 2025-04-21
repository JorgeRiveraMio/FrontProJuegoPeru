import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
    standalone: true,
    selector: 'app-blank',
    imports: [RouterOutlet,NgxSonnerToaster],
    templateUrl: './blank.component.html',
    styleUrl: './blank.component.css'
})
export class BlankComponent {

}
