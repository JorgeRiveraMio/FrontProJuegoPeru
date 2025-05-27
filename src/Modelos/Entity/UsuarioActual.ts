export interface UsuarioActual {
  idUsuario: number;
  name: string;
  lastname: string;
  dni: string;
  username: string;
  idRol: number;
  password?: string;

  especialidad?: string;
  estadoEmpleado?: string; 
  
  direccion?: string;
  telefono?: string;
  estadoTutor?: string;

  rol?: {
    id: number;
    name: string;
  };
}
