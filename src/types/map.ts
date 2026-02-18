import { Visita } from './visita';

export interface MapLocation {
  id: string;
  nombre: string;
  tipo: 'actividad' | 'visita' | 'voluntario' | 'mision';
  latitud: number;
  longitud: number;
  descripcion?: string;
  pais?: string;
  encargado?: string;
  fecha?: string;
  estado?: string;
  direccion?: string;
  visitaData?: Visita; // Datos completos de la visita cuando tipo es 'visita'
}
