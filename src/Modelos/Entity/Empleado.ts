import { EstadoEmpleado } from "../Enums/EstadoEmpleado";
import { Usuario } from "./Usuario";

export interface Empleado extends Usuario { 
    especialidad?: string; // Opcional, ya que solo es relevante si el tipo es TERAPEUTA
    estadoEmpleado: EstadoEmpleado; // LIBRE, OCUPADO, VACACIONES
}

export type EmpleadoRegistro = Omit<Empleado, 'idUsuario'>;