export interface Usuario {

    idUsuario: number;
    name: string;
    lastname: string;
    dni: string;
    username: string;
    password: string;
    idRol: number; 
}

export type UsuarioRegistro = Omit<Usuario, 'idUsuario'>;