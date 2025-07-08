import { Paciente } from "../Entity/Paciente"; // Asegúrate de que exista este modelo o créalo si es necesario
import { EstadoInforme } from "../Enums/EstadoInforme";

export interface InformeEvaluacionInicial {
    id?: number;
    paciente: Paciente;
    fechaUltimaTerapia: string; // ISO date string (ej: "2025-07-07")
    archivoUrl: string;          // ← URL del PDF desde Cloudinary
    observaciones: string;
    estadoInforme: EstadoInforme;
}
