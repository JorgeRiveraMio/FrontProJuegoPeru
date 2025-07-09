export interface Pago {
    id: number;
    monto: number;
    estado: string;
    metodoPago: string;
    referenciaPago: string;
    fechaPago: string;
    tutor: {
        name: string;
        lastname: string;
    };
    sesion: {
        id: number;
    };
}
