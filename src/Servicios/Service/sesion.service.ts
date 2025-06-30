import { inject, Injectable } from "@angular/core";
import { appsettingsCliente } from "../../Ajustes/app.settings";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SesionService {

    private readonly _apiUrl = appsettingsCliente.apiUrl + '/sesiones';
    private readonly http = inject(HttpClient);

    constructor() { }

}