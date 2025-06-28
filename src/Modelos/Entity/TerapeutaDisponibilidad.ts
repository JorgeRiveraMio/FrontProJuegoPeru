import { Empleado } from "./Empleado";

export interface TerapeutaDisponibilidad {
    empleadoId: Empleado;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
}
export type TerapeutaDisponibilidadReg = Omit<TerapeutaDisponibilidad, 'idTerapeutaDisponibilidad'>;