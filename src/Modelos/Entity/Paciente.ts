import { Sexo } from "../Enums/Sexo";
export interface Paciente { 
    nombre: string;
    apellido: string;
    fechaNacimiento: Date;
    sexo: Sexo;
    dni: string;
    direccion: string;
    telefono: string;
    escuela: string;
    gradoEscolar: string;
    tutor: { idUsuario: number };
}

export type PacienteRegistro = Omit<Paciente, 'idPaciente'>;