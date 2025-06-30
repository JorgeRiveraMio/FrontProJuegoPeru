import { NombreTipoSesion } from "../Enums/NombreTipoSesion";

export interface TipoSesion {
  id: number;
  nombre: NombreTipoSesion;
  descripcion: string;
  costo: number;
}