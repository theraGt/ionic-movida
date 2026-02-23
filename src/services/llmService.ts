// src/services/llmService.ts
import axios from 'axios';

const API_URL = 'http://localhost:3030'; // Cambia esto por la URL de tu backend

export interface CopilotoUser {
  id: number;
  email: string;
  nombre: string;
  activo: boolean;
}

export interface CopilotoAction {
  id: number;
  title: string;
  description: string;
  urgency: 'hoy' | 'manana' | 'esta_semana';
  completed: boolean;
  created_at: string;
  area?: string;
}

export interface CopilotoConversation {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  categoria: string;
  intensidad: number;
  created_at: string;
}

export interface CopilotoArea {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  color: string;
}

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

  // Login de usuario del Copiloto Emocional
  async loginCopiloto(email: string, password: string): Promise<{ success: boolean; data?: CopilotoUser; error?: string }> {
    try {
      const response = await axios.post(`${API_URL}/api/llm/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error en loginCopiloto:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al iniciar sesión'
      };
    }
  },

  // Registro de nuevo usuario
  async registerCopiloto(email: string, password: string, nombre: string): Promise<{ success: boolean; data?: CopilotoUser; error?: string }> {
    try {
      const response = await axios.post(`${API_URL}/api/llm/register`, {
        email,
        password,
        nombre
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error en registerCopiloto:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al registrar usuario'
      };
    }
  },

  // Obtener acciones del usuario
  async getUserActions(userId: number): Promise<{ success: boolean; data?: CopilotoAction[]; error?: string }> {
    try {
      const response = await axios.post(`${API_URL}/api/llm/actions`, {
        userId
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error en getUserActions:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al obtener acciones'
      };
    }
  },

  // Toggle acción completada
  async toggleAction(actionId: number, userId: number): Promise<{ success: boolean; data?: { id: number; completed: boolean }; error?: string }> {
    try {
      const response = await axios.post(`${API_URL}/api/llm/toggle-action`, {
        actionId,
        userId
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error en toggleAction:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al actualizar acción'
      };
    }
  },

  // Actualizar acción
  async updateAction(
    actionId: number,
    userId: number,
    data: { title?: string; description?: string; urgency?: string; area?: string }
  ): Promise<{ success: boolean; data?: CopilotoAction; error?: string }> {
    try {
      const response = await axios.post(`${API_URL}/api/llm/update-action`, {
        actionId,
        userId,
        ...data
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error en updateAction:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al actualizar acción'
      };
    }
  },

  // Eliminar acción
  async deleteAction(actionId: number, userId: number): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await axios.post(`${API_URL}/api/llm/delete-action`, {
        actionId,
        userId
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error en deleteAction:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al eliminar acción'
      };
    }
  },

  // Crear nueva acción
  async createAction(
    userId: number,
    area: string,
    title: string,
    description: string,
    urgency: string
  ): Promise<{ success: boolean; data?: CopilotoAction; error?: string }> {
    try {
      const response = await axios.post(`${API_URL}/api/llm/create-action`, {
        userId,
        area,
        title,
        description,
        urgency
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error en createAction:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al crear acción'
      };
    }
  },

  // Copiloto Emocional con guía bíblica (actualizado con memoria)
  async copilotoEmocional(
    texto: string, 
    categoria: string = 'salud',
    userId?: number,
    area?: string,
    sessionId?: string
  ) {
    try {
      const response = await axios.post(`${API_URL}/api/llm/copiloto-emocional`, {
        texto,
        categoria,
        userId,
        area,
        sessionId
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error en copilotoEmocional:', error);
      throw new Error(error.response?.data?.message || 'Error al procesar con el Copiloto Emocional');
    }
  },

  // Obtener conversaciones del usuario por área
  async getUserConversations(userId: number, area: string): Promise<{ success: boolean; data?: CopilotoConversation[]; error?: string }> {
    try {
      const response = await axios.post(`${API_URL}/api/llm/conversations`, {
        userId,
        area
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error en getUserConversations:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al obtener conversaciones'
      };
    }
  },

  // Obtener todas las conversaciones del usuario
  async getAllUserConversations(userId: number): Promise<{ success: boolean; data?: { [area: string]: CopilotoConversation[] }; error?: string }> {
    try {
      const response = await axios.post(`${API_URL}/api/llm/all-conversations`, {
        userId
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error en getAllUserConversations:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al obtener conversaciones'
      };
    }
  }
};
