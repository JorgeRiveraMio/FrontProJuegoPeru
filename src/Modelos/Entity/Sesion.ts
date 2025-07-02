import { EstadoSesion } from "../Enums/EstadoSesion";
import { Empleado } from "./Empleado";
import { Paciente } from "./Paciente";
import { TipoSesion } from "./TipoSesion";

export interface Sesion {
    id: number;
    paciente: Paciente;
    terapeuta:Empleado;
    administrador?: Empleado;
    tipoSesion:TipoSesion;
    fechaSesion: Date;
    hora: string;
    fechaRegistro: Date;
    estado: EstadoSesion;
}