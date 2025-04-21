import { Persona } from "./Persona";
import { TipoUsuario } from "../Enums/TipoUsuario";
import { Rol } from "./Rol";

export interface Usuario extends Persona {
    username: string;
    password: string;
    tipoUsuario:TipoUsuario;
    roles: string[];
}
export type UsuarioRegistro = Omit<Usuario, 'idPersona' >