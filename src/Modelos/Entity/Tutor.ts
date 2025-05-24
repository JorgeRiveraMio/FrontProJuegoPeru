import { EstadoTutor } from '../Enums/EstadoTutor';
import { Usuario } from './Usuario';

export interface Tutor extends Usuario {
    
    direccion: string;
    telefono: string;
    estado: EstadoTutor; // ACTIVO, INACTIVO
}

export type TutorRegistro = Omit<Tutor, 'idUsuario'>;
