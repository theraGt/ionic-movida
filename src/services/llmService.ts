// src/services/llmService.ts
import axios from 'axios';

const API_URL = 'http://localhost:3030'; // Cambia esto por la URL de tu backend

export interface VisitaData {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  actividad: string;
  tipo: string;
  estado: string;
  pais: string;
  comentario?: string;
  fotos?: string[];
}

export interface NoticiaGenerada {
  titulo: string;
  contenido: string;
  resumen: string;
  categoria: string;
}

export interface GenerarContenidoResponse {
  success: boolean;
  data: NoticiaGenerada;
  modelo: string;
  provider?: string;
  fechaGeneracion: string;
}

export const llmService = {
  // Generar contenido a partir de datos de visita
  async generarContenidoVisita(data: VisitaData): Promise<GenerarContenidoResponse> {
    try {
      const response = await axios.post(`${API_URL}/api/llm/generar-visita`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error en generarContenidoVisita:', error);
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Error al generar contenido');
    }
  },

  // Generar noticia personalizada
  async generarContenidoNoticia(data: any) {
    try {
      const response = await axios.post(`${API_URL}/api/llm/generar-noticia`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error en generarContenidoNoticia:', error);
      throw new Error(error.response?.data?.message || 'Error al generar noticia');
    }
  },

  // Mejorar texto existente
  async mejorarTexto(data: { texto: string; instrucciones?: string; tono?: string }) {
    try {
      const response = await axios.post(`${API_URL}/api/llm/mejorar-texto`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error en mejorarTexto:', error);
      throw new Error(error.response?.data?.message || 'Error al mejorar texto');
    }
  },
};
