import { Usuario } from "./Usuario";
import { TipoEmpleado } from "../Enums/TipoEmpleado";
import { EstadoEmpleado } from "../Enums/EstadoEmpleado";

export interface Empleado extends Usuario { // Hereda de Usuario
    tipoEmpleado: TipoEmpleado; // ADMIN, TERAPEUTA
    especialidad?: string; // Opcional, ya que solo es relevante si el tipo es TERAPEUTA
    estadoEmpleado: EstadoEmpleado; // LIBRE, OCUPADO, VACACIONES
}

export type EmpleadoRegistro = Omit<Usuario, 'idPersona'>;
