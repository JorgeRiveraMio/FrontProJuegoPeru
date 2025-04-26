import { EstadoCliente } from "../Enums/EstadoCliente";
import { Usuario } from "./Usuario";

export interface Cliente extends Usuario { 
    direccion: string; 
    telefono: string; 
    estado: EstadoCliente; // ACTIVO, INACTIVO
}

export type ClienteRegistro = Omit<Cliente, 'idUsuario'>;
