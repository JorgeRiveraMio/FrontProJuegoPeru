export interface UsuarioActual {
  idUsuario: number;
  name: string;
  lastname: string;
  dni: string;
  username: string;
  idRol: number;
  
  especialidad?: string;
  estadoEmpleado?: string; 
  
  direccion?: string;
  telefono?: string;
  estadoTutor?: string;
}
