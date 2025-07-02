import { Sexo } from "../Enums/Sexo";
export interface Paciente { 
    id?: number;
    nombre: string;
    apellido: string;
    fechaNacimiento: Date;
    sexo: Sexo;
    dni: string;
    direccion: string;
    telefono: string;
    escuela: string;
    gradoEscolar: string;
    tutor: { idUsuario: number, name?: string, lastname?: string };
}

export type PacienteRegistro = Omit<Paciente, 'idPaciente'>;