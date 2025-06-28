import { Empleado } from "./Empleado";

export interface TerapeutaDisponibilidad {
    id?: number;
    empleadoId?: number;
    empleado?: Empleado;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
}