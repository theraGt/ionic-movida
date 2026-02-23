export interface Activity {
    id: string;
    fecha: string;
    hora: string;
    horaInicio?: string;
    actividad: string;
    tipo: string;
    estado: string;
    pais: string;
    comentario?: string;
}

export interface ActivityInput {
    fecha: string;
    hora: string;
    actividad: string;
    tipo: string;
    estado: string;
    pais: string;
    comentario?: string;
}