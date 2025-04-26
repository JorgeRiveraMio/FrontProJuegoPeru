import { TipoUsuario } from "../Enums/TipoUsuario";
import { Rol } from "./Rol";

export interface Usuario {

    idUsuario: number;
    name: string;
    lastname: string;
    dni: string;
    username: string;
    password: string;
    tipoUsuario: TipoUsuario;
    rol: Rol; 
}

export type UsuarioRegistro = Omit<Usuario, 'idUsuario'>;

