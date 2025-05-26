import { EstadoEmpleado } from "../Enums/EstadoEmpleado";

export interface EmpleadoActualizacion {
  name: string;
  lastname: string;
  dni: string;
  username: string;
  idRol: number;
  especialidad?: string;
  estadoEmpleado: EstadoEmpleado;
}