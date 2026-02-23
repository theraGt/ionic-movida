<template>
  <ion-page>
    <LoginCopiloto v-if="!isLoggedIn" :onLogin="handleLogin" />

    <div v-else class="layout-container">
      <Sidebar />

      <div class="main-content">
        <Header>
          <template #search>
            <div class="breadcrumb-search">
              <div class="breadcrumb">
                <span>Copiloto Emocional</span>
                <ion-icon :icon="chevronForward" />
                <span class="current">{{ proyectoActual?.nombre || 'Proyectos' }}</span>
              </div>
            </div>
          </template>
          <template #actions>
            <button class="btn-user" @click="logout">
              <ion-icon :icon="personCircleOutline" />
              <span>{{ currentUser?.nombre }}</span>
            </button>
            <button class="btn-crisis" @click="mostrarCrisis = true">
              <ion-icon :icon="alertCircleOutline" />
              <span>Crisis</span>
            </button>
            <button class="btn-analisis" @click="mostrarDashboard = true">
              <ion-icon :icon="analyticsOutline" />
              <span>Dashboard</span>
            </button>
          </template>
        </Header>

        <div class="content-area">
          <aside class="projects-sidebar">
            <div class="sidebar-header">
              <h3>Areas de Vida</h3>
            </div>
            <div class="projects-list">
              <div v-for="proyecto in proyectos" :key="proyecto.id" class="project-item"
                :class="{ 'active': proyectoActual?.id === proyecto.id }" @click="seleccionarProyecto(proyecto)">
                <div class="project-icon" :class="proyecto.id">
                  <ion-icon :icon="proyecto.icono" />
                </div>
                <div class="project-info">
                  <span class="project-name">{{ proyecto.nombre }}</span>
                  <span class="project-stats">{{ proyecto.conversaciones }} conv.</span>
                </div>
                <div class="project-progress" v-if="proyecto.accionesPendientes > 0">
                  <span class="pending-badge">{{ proyecto.accionesPendientes }}</span>
                </div>
              </div>
            </div>

            <div class="sidebar-footer">
              <button class="btn-new-project" @click="crearNuevoProyecto">
                <ion-icon :icon="addCircleOutline" />
                <span>Nueva Area</span>
              </button>
            </div>
          </aside>

          <div class="chat-container">
            <div class="chat-header">
              <div class="chat-project-info" v-if="proyectoActual">
                <div class="project-icon-small" :class="proyectoActual.id">
                  <ion-icon :icon="proyectoActual.icono" />
                </div>
                <div class="project-details">
                  <h3>{{ proyectoActual.nombre }}</h3>
                  <span>{{ proyectoActual.descripcion }}</span>
                </div>
              </div>
              <div class="chat-actions">
                <button class="icon-btn" @click="mostrarHistorial = !mostrarHistorial" title="Historial">
                  <ion-icon :icon="timeOutline" />
                </button>
                <button class="icon-btn" @click="mostrarAcciones = !mostrarAcciones" title="Acciones">
                  <ion-icon :icon="checkboxOutline" />
                  <span v-if="accionesPendientesCount > 0" class="badge">{{ accionesPendientesCount }}</span>
                </button>
              </div>
            </div>

            <div class="chat-messages" ref="messagesContainer">
              <div v-if="conversaciones.length === 0" class="welcome-message">
                <div class="welcome-icon">
                  <ion-icon :icon="heartCircleOutline" />
                </div>
                <h2>{{ proyectoActual ? 'Hablemos de ' + proyectoActual.nombre : 'Hola, soy tu Copiloto Emocional' }}
                </h2>
                <p v-if="currentUser">Hola {{ currentUser.nombre }}, {{ proyectoActual ? proyectoActual.bienvenida :
                  '¿Qué tienes en la mente ? ' }}</p>
                <p v-else>{{ proyectoActual ? proyectoActual.bienvenida : '¿Qué tienes en la mente?' }}</p>

                <div class="quick-prompts" v-if="proyectoActual">
                  <button v-for="prompt in proyectoActual.prompts" :key="prompt" class="prompt-btn"
                    @click="usarPrompt(prompt)">
                    {{ prompt }}
                  </button>
                </div>
              </div>

              <div v-for="(msg, index) in conversaciones" :key="index" class="message"
                :class="{ 'user-message': msg.tipo === 'usuario', 'ai-message': msg.tipo === 'ai' }">
                <div class="message-avatar">
                  <ion-icon v-if="msg.tipo === 'usuario'" :icon="personCircleOutline" />
                  <ion-icon v-else :icon="heartCircleOutline" />
                </div>
                <div class="message-content">
                  <div v-if="msg.reflejo" class="reflejo-card">
                    <div class="reflejo-header">
                      <ion-icon :icon="heartOutline" />
                      <span>Te entiendo</span>
                    </div>
                    <p>{{ msg.reflejo }}</p>
                  </div>

                  <div v-if="msg.sabiduria" class="sabiduria-card">
                    <div class="sabiduria-header">
                      <ion-icon :icon="bulbOutline" />
                      <span>Una reflexión</span>
                    </div>
                    <p>{{ msg.sabiduria }}</p>
                  </div>

                  <div v-if="msg.recomendacion" class="recommendation-card">
                    <div class="rec-header">
                      <ion-icon :icon="bulbOutline" />
                      <span>Acciones</span>
                    </div>
                    <p>{{ msg.recomendacion.texto }}</p>
                    <div class="rec-actions" v-if="msg.recomendacion.acciones">
                      <button v-for="(accion, idx) in msg.recomendacion.acciones" :key="idx" class="rec-action-btn"
                        @click="aceptarAccion(accion, msg)">
                        <ion-icon :icon="addCircleOutline" />
                        {{ accion }}
                      </button>
                    </div>
                  </div>

                  <p v-if="!msg.reflejo && !msg.sabiduria && !msg.recomendacion">{{ msg.texto }}</p>
                  <span class="message-time">{{ msg.hora }}</span>
                </div>
              </div>

              <div v-if="cargando" class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <div class="chat-input-area">
              <div class="input-wrapper">
                <textarea v-model="mensaje"
                  :placeholder="proyectoActual ? 'Que pasa con ' + proyectoActual.nombre + '?' : 'Que tienes en la mente?'"
                  @keydown.enter.exact.prevent="enviarMensaje" @input="autoResize" rows="1" ref="inputRef"></textarea>
                <button class="btn-voice" @click="toggleVoice" :class="{ 'recording': grabando }">
                  <ion-icon :icon="micOutline" />
                </button>
              </div>
              <button class="btn-send" @click="enviarMensaje" :disabled="!mensaje.trim() || cargando">
                <ion-icon :icon="sendOutline" />
              </button>
            </div>
          </div>

          <aside v-if="mostrarAcciones" class="actions-sidebar">
            <div class="sidebar-header">
              <h3>Acciones Pendientes</h3>
              <button @click="mostrarAcciones = false">
                <ion-icon :icon="closeOutline" />
              </button>
            </div>
            <div class="actions-view-toggle">
              <button :class="{ active: vistaAcciones === 'fecha' }" @click="vistaAcciones = 'fecha'">
                Por fecha
              </button>
              <button :class="{ active: vistaAcciones === 'proyecto' }" @click="vistaAcciones = 'proyecto'">
                Por proyecto
              </button>
            </div>
            <div class="actions-list">
              <ion-item-sliding v-for="accion in accionesOrdenadas" :key="accion.id" class="action-slide">
                <ion-item>
                  <div class="action-item" :class="{
                    'completed': accion.completada,
                    'urgencia-hoy': accion.fecha === 'Hoy' && !accion.completada,
                    'urgencia-manana': accion.fecha === 'Mañana' && !accion.completada,
                    'urgencia-semana': accion.fecha === 'Esta semana' && !accion.completada,
                    [getAreaClass(accion.proyecto)]: true
                  }">
                    <button class="checkbox" @click="toggleAccion(accion)">
                      <ion-icon v-if="accion.completada" :icon="checkboxOutline" />
                      <ion-icon v-else :icon="squareOutline" />
                    </button>
                    <div class="action-content">
                      <span class="action-title">{{ accion.titulo }}</span>
                      <span class="action-description" v-if="accion.descripcion">{{ accion.descripcion }}</span>
                      <span class="action-meta">
                        <span class="accion-proyecto" :class="getAreaClass(accion.proyecto) + '-text'">{{
                          accion.proyecto
                          }}</span>
                        <span class="accion-fecha" :class="'fecha-' + accion.fecha.toLowerCase().replace(' ', '-')">{{
                          accion.fecha
                          }}</span>
                      </span>
                    </div>
                  </div>
                </ion-item>

                <ion-item-options side="start">
                  <ion-item-option @click="eliminarAccion(accion)" color="danger">
                    <ion-icon :icon="trashOutline" slot="icon-only" />
                  </ion-item-option>
                </ion-item-options>

                <ion-item-options side="end">
                  <ion-item-option @click="abrirEdicion(accion)" color="primary">
                    <ion-icon :icon="createOutline" slot="icon-only" />
                  </ion-item-option>
                </ion-item-options>
              </ion-item-sliding>

              <div v-if="accionesGlobales.length === 0" class="empty-actions">
                <ion-icon :icon="checkmarkCircleOutline" />
                <p>Sin acciones pendientes!</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>

    <ion-modal :is-open="mostrarDashboard" @didDismiss="mostrarDashboard = false">
      <div class="dashboard-modal">
        <div class="dashboard-header">
          <h2>Tu Panel de Progreso</h2>
          <button @click="mostrarDashboard = false">
            <ion-icon :icon="closeOutline" />
          </button>
        </div>

        <div class="dashboard-content">
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-icon">
                <ion-icon :icon="chatbubblesOutline" />
              </div>
              <div class="kpi-data">
                <span class="kpi-value">{{ kpis.totalConversaciones }}</span>
                <span class="kpi-label">Conversaciones</span>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-icon green">
                <ion-icon :icon="checkmarkCircleOutline" />
              </div>
              <div class="kpi-data">
                <span class="kpi-value">{{ kpis.accionesCompletadas }}</span>
                <span class="kpi-label">Acciones Completadas</span>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-icon yellow">
                <ion-icon :icon="timeOutline" />
              </div>
              <div class="kpi-data">
                <span class="kpi-value">{{ kpis.accionesPendientes }}</span>
                <span class="kpi-label">Pendientes</span>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-icon purple">
                <ion-icon :icon="trendingUpOutline" />
              </div>
              <div class="kpi-data">
                <span class="kpi-value">{{ kpis.progresoSemanal }}%</span>
                <span class="kpi-label">Progreso Semanal</span>
              </div>
            </div>
          </div>

          <div class="chart-section">
            <h3>Conversaciones por Area</h3>
            <div class="bar-chart">
              <div v-for="(data, area) in kpis.porArea" :key="area" class="bar-item">
                <div class="bar-label">{{ getAreaLabel(area) }}</div>
                <div class="bar-track">
                  <div class="bar-fill" :class="area" :style="{ width: (data / kpis.totalConversaciones * 100) + '%' }">
                  </div>
                </div>
                <div class="bar-value">{{ data }}</div>
              </div>
            </div>
          </div>

          <div class="recommendations-section">
            <h3>Recomendaciones Activas</h3>
            <div v-for="rec in kpis.recomendacionesActivas" :key="rec.id" class="rec-item">
              <div class="rec-icon" :class="rec.area">
                <ion-icon :icon="getAreaIcon(rec.area)" />
              </div>
              <div class="rec-content">
                <span class="rec-title">{{ rec.titulo }}</span>
                <span class="rec-area">{{ getAreaLabel(rec.area) }}</span>
              </div>
              <div class="rec-status" :class="rec.estado">
                {{ rec.estado }}
              </div>
            </div>
          </div>

          <div class="insight-section">
            <div class="insight-card">
              <ion-icon :icon="bulbOutline" />
              <div class="insight-content">
                <h4>Insight de la Semana</h4>
                <p>{{ kpis.insight }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-modal>

    <ion-modal :is-open="mostrarCrisis" @didDismiss="mostrarCrisis = false">
      <div class="crisis-modal">
        <div class="crisis-content">
          <div class="crisis-icon">
            <ion-icon :icon="heartOutline" />
          </div>
          <h2>Necesitas ayuda inmediata?</h2>
          <p>Si estas pasando por una crisis emocional, no estas solo. Hay personas que pueden ayudarte.</p>

          <div class="crisis-options">
            <a href="tel:1577" class="crisis-btn primary">
              <ion-icon :icon="callOutline" />
              <span>Linea de Ayuda</span>
              <small>1577</small>
            </a>

            <button class="crisis-btn secondary" @click="hablarConCopiloto">
              <ion-icon :icon="chatbubblesOutline" />
              <span>Hablar conmigo</span>
            </button>
          </div>

          <div class="crisis-tips">
            <h4>Mientras habla con alguien:</h4>
            <ul>
              <li>Respire profundamente</li>
              <li>Piense en un lugar seguro</li>
              <li>Recuerde que esto pasara</li>
            </ul>
          </div>
        </div>
      </div>
    </ion-modal>

    <ion-modal :is-open="mostrarModalEdicion" @didDismiss="mostrarModalEdicion = false" :breakpoints="[0, 1]"
      :initial-breakpoint="1" :backdrop-dismiss="true" :backdrop-breakpoint="0.8">
      <div class="edit-action-modal">
        <div class="modal-drag-handle"></div>

        <div class="modal-header">
          <div class="header-content">
            <div class="header-icon">
              <ion-icon :icon="createOutline" />
            </div>
            <div class="header-text">
              <h2>Editar Acción</h2>
              <p class="header-subtitle">Personaliza los detalles de tu tarea</p>
            </div>
          </div>
          <button class="close-btn" @click="mostrarModalEdicion = false">
            <ion-icon :icon="closeOutline" />
          </button>
        </div>

        <div class="modal-preview" v-if="accionEditada.titulo">
          <div class="preview-label">Vista previa</div>
          <div class="preview-card">
            <div class="preview-checkbox">
              <ion-icon :icon="squareOutline" />
            </div>
            <div class="preview-content">
              <span class="preview-title">{{ accionEditada.titulo || 'Sin título' }}</span>
              <div class="preview-meta">
                <span class="preview-area">{{ accionEditada.proyecto || 'Sin área' }}</span>
                <span class="preview-dot">•</span>
                <span class="preview-date" :class="'urgency-' + accionEditada.fecha.toLowerCase().replace(' ', '-')">{{
                  accionEditada.fecha || 'Sin fecha' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-body">
          <div class="form-section">
            <div class="section-title">
              <ion-icon :icon="textOutline" />
              <span>Información básica</span>
            </div>

            <div class="form-group">
              <label>
                Título de la acción
                <span class="char-count">{{ (accionEditada.titulo || '').length }}/50</span>
              </label>
              <input type="text" v-model="accionEditada.titulo" placeholder="¿Qué necesitas hacer?" maxlength="50"
                class="input-title" />
            </div>

            <div class="form-group">
              <label>Descripción (opcional)</label>
              <textarea v-model="accionEditada.descripcion"
                placeholder="Agrega más contexto o detalles sobre esta acción..." rows="3"
                class="input-description"></textarea>
            </div>
          </div>

          <div class="form-section">
            <div class="section-title">
              <ion-icon :icon="settingsOutline" />
              <span>Configuración</span>
            </div>

            <div class="form-group">
              <label>
                <ion-icon :icon="folderOutline" />
                Área de vida
              </label>
              <div class="area-selector">
                <button v-for="proy in proyectos" :key="proy.id" class="area-option"
                  :class="{ 'selected': accionEditada.proyecto === proy.nombre, [proy.id]: true }"
                  @click="accionEditada.proyecto = proy.nombre">
                  <ion-icon :icon="proy.icono" />
                  <span>{{ proy.nombre }}</span>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label>
                <ion-icon :icon="calendarOutline" />
                ¿Cuándo?
              </label>
              <div class="date-selector">
                <button class="date-option urgency-hoy" :class="{ 'selected': accionEditada.fecha === 'Hoy' }"
                  @click="accionEditada.fecha = 'Hoy'">
                  <span class="date-label">Hoy</span>
                  <span class="date-desc">Urgente</span>
                </button>
                <button class="date-option urgency-manana" :class="{ 'selected': accionEditada.fecha === 'Mañana' }"
                  @click="accionEditada.fecha = 'Mañana'">
                  <span class="date-label">Mañana</span>
                  <span class="date-desc">Próximo</span>
                </button>
                <button class="date-option urgency-semana"
                  :class="{ 'selected': accionEditada.fecha === 'Esta semana' }"
                  @click="accionEditada.fecha = 'Esta semana'">
                  <span class="date-label">Esta semana</span>
                  <span class="date-desc">Programado</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-delete-action" @click="eliminarYCerrar" v-if="accionEditando">
            <ion-icon :icon="trashOutline" />
            <span>Eliminar</span>
          </button>
          <div class="footer-spacer" v-else></div>
          <div class="footer-actions">
            <button class="btn-cancel" @click="mostrarModalEdicion = false">
              Cancelar
            </button>
            <button class="btn-save" @click="guardarEdicion">
              <ion-icon :icon="checkmarkOutline" />
              <span>Guardar cambios</span>
            </button>
          </div>
        </div>
      </div>
    </ion-modal>

    <ion-modal :is-open="mostrarModalNuevaArea" @didDismiss="mostrarModalNuevaArea = false" :breakpoints="[0, 0.5, 0.9]"
      :initial-breakpoint="0.5">
      <div class="new-area-modal">
        <div class="modal-header">
          <div class="header-content">
            <div class="header-icon new-area">
              <ion-icon :icon="addCircleOutline" />
            </div>
            <div>
              <h2>Nueva Área de Vida</h2>
              <p class="header-subtitle">Crea un nuevo espacio para trabajar</p>
            </div>
          </div>
          <button class="close-btn" @click="mostrarModalNuevaArea = false">
            <ion-icon :icon="closeOutline" />
          </button>
        </div>
        <div class="modal-content">
          <div class="form-group">
            <label>Nombre del área</label>
            <input type="text" v-model="nuevaAreaNombre" placeholder="Ej: Estudios, Hobby, Familia..." maxlength="30" />
          </div>
          <div class="form-group">
            <label>Descripción (opcional)</label>
            <textarea v-model="nuevaAreaDescripcion" placeholder="¿De qué trata esta área de tu vida?"
              rows="2"></textarea>
          </div>
          <button class="btn-create-area" @click="guardarNuevaArea" :disabled="!nuevaAreaNombre.trim()">
            <ion-icon :icon="checkmarkOutline" />
            Crear Área
          </button>
        </div>
      </div>
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue';
import { IonPage, IonIcon, IonModal, IonItemSliding, IonItemOption, IonItem } from '@ionic/vue';
import {
  chevronForward,
  heartCircleOutline,
  heartOutline,
  personCircleOutline,
  micOutline,
  sendOutline,
  timeOutline,
  analyticsOutline,
  closeOutline,
  bulbOutline,
  addCircleOutline,
  checkboxOutline,
  squareOutline,
  checkmarkCircleOutline,
  trendingUpOutline,
  chatbubblesOutline,
  callOutline,
  walletOutline,
  peopleOutline,
  briefcaseOutline,
  bookmarkOutline,
  trophyOutline,
  leafOutline,
  alertCircleOutline,
  logOutOutline,
  createOutline,
  trashOutline,
  textOutline,
  documentTextOutline,
  folderOutline,
  calendarOutline,
  settingsOutline,
  checkmarkOutline
} from 'ionicons/icons';
import Sidebar from '@/components/Layout/Sidebar.vue';
import Header from '@/components/Layout/Header.vue';
import { llmService, type CopilotoUser, type CopilotoAction, type CopilotoConversation } from '@/services/llmService';
import LoginCopiloto from './LoginCopiloto.vue';

interface Mensaje {
  tipo: 'usuario' | 'ai';
  texto: string;
  reflejo?: string;
  sabiduria?: string;
  hora: string;
  recomendacion?: {
    texto: string;
    acciones?: string[];
  };
  intensidad?: number;
}

interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  icono: any;
  conversaciones: number;
  accionesPendientes: number;
  bienvenida: string;
  prompts: string[];
}

interface Accion {
  id: number;
  titulo: string;
  descripcion: string;
  proyecto: string;
  fecha: string;
  completada: boolean;
}

const isLoggedIn = ref(false);
const currentUser = ref<CopilotoUser | null>(null);
const sessionId = ref('');

const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const handleLogin = (user: CopilotoUser) => {
  currentUser.value = user;
  isLoggedIn.value = true;
  sessionId.value = generateSessionId();
  cargarAccionesUsuario();
};

const logout = () => {
  localStorage.removeItem('copilotoUser');
  currentUser.value = null;
  isLoggedIn.value = false;
  sessionId.value = '';
  conversaciones.value = [];
};

const checkStoredSession = () => {
  const storedUser = localStorage.getItem('copilotoUser');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      currentUser.value = user;
      isLoggedIn.value = true;
      sessionId.value = generateSessionId();
      cargarAccionesUsuario();
    } catch (e) {
      localStorage.removeItem('copilotoUser');
    }
  }
};

const cargarAccionesUsuario = async () => {
  if (!currentUser.value) return;

  try {
    const result = await llmService.getUserActions(currentUser.value.id);
    if (result.success && result.data) {
      accionesGlobales.value = result.data.map((a: CopilotoAction) => ({
        id: a.id,
        titulo: a.title || '',
        descripcion: a.description || '',
        proyecto: a.area || 'General',
        fecha: a.urgency === 'hoy' ? 'Hoy' : a.urgency === 'manana' ? 'Mañana' : 'Esta semana',
        completada: a.completed
      }));
    }
  } catch (e) {
    console.error('Error cargando acciones:', e);
  }
};

const mensaje = ref('');
const conversaciones = ref<Mensaje[]>([]);
const cargando = ref(false);
const grabando = ref(false);
const mostrarHistorial = ref(false);
const mostrarDashboard = ref(false);
const mostrarAcciones = ref(false);
const mostrarCrisis = ref(false);
const mostrarModalNuevaArea = ref(false);
const nuevaAreaNombre = ref('');
const nuevaAreaDescripcion = ref('');
const messagesContainer = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLTextAreaElement | null>(null);

const autoResize = () => {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto';
    inputRef.value.style.height = Math.min(inputRef.value.scrollHeight, 150) + 'px';
  }
};

const proyectoActual = ref<Proyecto | null>(null);

const proyectos = ref<Proyecto[]>([
  {
    id: 'finanzas',
    nombre: 'Finanzas',
    descripcion: 'Gestion economica y metas financieras',
    icono: walletOutline,
    conversaciones: 8,
    accionesPendientes: 2,
    bienvenida: 'Hablemos de tus finanzas. Que situacion estas enfrentando?',
    prompts: [
      'No se como pagar mis deudas',
      'Quiero empezar a ahorrar',
      'Mis ingresos no me alcanzan'
    ]
  },
  {
    id: 'relaciones',
    nombre: 'Relaciones',
    descripcion: 'Familia, pareja, amigos',
    icono: peopleOutline,
    conversaciones: 5,
    accionesPendientes: 1,
    bienvenida: 'Las relaciones son importantes. Que esta pasando?',
    prompts: [
      'Tuve un problema con mi pareja',
      'No me llevo bien con mi familia',
      'Quiero mejorar mis amistades'
    ]
  },
  {
    id: 'trabajo',
    nombre: 'Trabajo',
    descripcion: 'Carrera profesional y empleo',
    icono: briefcaseOutline,
    conversaciones: 6,
    accionesPendientes: 0,
    bienvenida: 'Hablemos de tu vida laboral. Que te preocupa?',
    prompts: [
      'Quiero renunciar pero tengo miedo',
      'Mi jefe me supera',
      'No encuentro trabajo'
    ]
  },
  {
    id: 'fe',
    nombre: 'Fe',
    descripcion: 'Espiritualidad y proposito',
    icono: bookmarkOutline,
    comunidades: 3,
    accionesPendientes: 0,
    bienvenida: 'Tu vida espiritual es importante. Como estas?',
    prompts: [
      'Me siento lejos de Dios',
      'Quiero involucrarme mas en iglesia',
      'Tengo dudas espirituales'
    ]
  },
  {
    id: 'metas',
    nombre: 'Metas',
    descripcion: 'Suenos y objetivos de vida',
    icono: trophyOutline,
    conversaciones: 4,
    accionesPendientes: 3,
    bienvenida: 'Hablemos de tus suenos. Que quieres lograr?',
    prompts: [
      'No se que hacer con mi vida',
      'Tengo muchas ideas pero no actuo',
      'Quiero cumplir mis propositos'
    ]
  },
  {
    id: 'salud',
    nombre: 'Bienestar',
    descripcion: 'Salud mental y fisica',
    icono: leafOutline,
    conversaciones: 12,
    accionesPendientes: 1,
    bienvenida: 'Tu bienestar es prioridad. Como te sientes?',
    prompts: [
      'Estoy muy estresado',
      'No puedo dormir',
      'Me siento triste'
    ]
  }
]);

const accionesGlobales = ref<Accion[]>([
  { id: 1, titulo: 'Crear presupuesto', descripcion: 'Crear un presupuesto semanal para controlar gastos', proyecto: 'Finanzas', fecha: 'Hoy', completada: false },
  { id: 2, titulo: 'Hablar con mi pareja', descripcion: 'Tener una conversación abierta sobre el tema que preocupa', proyecto: 'Relaciones', fecha: 'Mañana', completada: false },
  { id: 3, titulo: 'Actualizar CV', descripcion: 'Actualizar el currículum vitae con las últimas experiencias', proyecto: 'Trabajo', fecha: 'Esta semana', completada: true },
  { id: 4, titulo: 'Establecer meta de ahorro', descripcion: 'Definir una meta mensual de ahorro realista', proyecto: 'Finanzas', fecha: 'Esta semana', completada: false },
  { id: 5, titulo: 'Hacer ejercicio', descripcion: 'Realizar ejercicio físico 3 veces por semana', proyecto: 'Bienestar', fecha: 'Esta semana', completada: false },
]);

const vistaAcciones = ref<'fecha' | 'proyecto'>('fecha');
const mostrarModalEdicion = ref(false);
const accionEditando = ref<Accion | null>(null);
const accionEditada = ref({
  titulo: '',
  descripcion: '',
  proyecto: '',
  fecha: ''
});

const accionesPendientesCount = computed(() =>
  accionesGlobales.value.filter(a => !a.completada).length
);

const accionesOrdenadas = computed(() => {
  const acciones = [...accionesGlobales.value];

  if (vistaAcciones.value === 'fecha') {
    const ordenFecha: Record<string, number> = { 'Hoy': 1, 'Mañana': 2, 'Esta semana': 3 };
    return acciones.sort((a, b) => {
      if (a.completada !== b.completada) return a.completada ? 1 : -1;
      return (ordenFecha[a.fecha] || 3) - (ordenFecha[b.fecha] || 3);
    });
  } else {
    return acciones.sort((a, b) => {
      if (a.completada !== b.completada) return a.completada ? 1 : -1;
      return a.proyecto.localeCompare(b.proyecto);
    });
  }
});

const kpis = ref({
  totalConversaciones: 35,
  accionesCompletadas: 12,
  accionesPendientes: 7,
  progresoSemanal: 65,
  porArea: {
    finanzas: 8,
    relaciones: 5,
    trabajo: 6,
    fe: 3,
    metas: 4,
    salud: 9
  },
  recomendacionesActivas: [
    { id: 1, titulo: 'Crear presupuesto', area: 'finanzas', estado: 'pendiente' },
    { id: 2, titulo: 'Establecer meta de ahorro', area: 'finanzas', estado: 'en_progreso' },
    { id: 3, titulo: 'Comunicacion con pareja', area: 'relaciones', estado: 'pendiente' },
    { id: 4, titulo: 'Buscar nuevas oportunidades', area: 'trabajo', estado: 'completada' }
  ],
  insight: 'Esta semana has mejorado un 65% en tus acciones. El area de finanzas requiere mas atencion. Te gustaria enfocarte en crear un plan de accion?'
});

const getAreaLabel = (area: string): string => {
  const labels: Record<string, string> = {
    finanzas: 'Finanzas',
    relaciones: 'Relaciones',
    trabajo: 'Trabajo',
    fe: 'Fe',
    metas: 'Metas',
    salud: 'Bienestar'
  };
  return labels[area] || area;
};

const getAreaIcon = (area: string): any => {
  const icons: Record<string, any> = {
    finanzas: walletOutline,
    relaciones: peopleOutline,
    trabajo: briefcaseOutline,
    fe: bookmarkOutline,
    metas: trophyOutline,
    salud: leafOutline
  };
  return icons[area] || leafOutline;
};

const getAreaClass = (area: string): string => {
  const areaLower = area.toLowerCase();
  if (areaLower.includes('finanza')) return 'area-finanzas';
  if (areaLower.includes('relac')) return 'area-relaciones';
  if (areaLower.includes('trabajo')) return 'area-trabajo';
  if (areaLower.includes('fe') || areaLower.includes('espiri')) return 'area-fe';
  if (areaLower.includes('meta') || areaLower.includes('sueño')) return 'area-metas';
  if (areaLower.includes('salud') || areaLower.includes('bienestar')) return 'area-salud';
  return 'area-default';
};

const cargarConversacionesArea = async (area: string) => {
  if (!currentUser.value) {
    conversaciones.value = [];
    return;
  }

  try {
    const result = await llmService.getUserConversations(currentUser.value.id, area);
    if (result.success && result.data) {
      conversaciones.value = result.data.map((msg: CopilotoConversation) => ({
        tipo: msg.role === 'user' ? 'usuario' : 'ai',
        texto: msg.content,
        reflejo: '',
        sabiduria: '',
        hora: new Date(msg.created_at).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })
      }));
    } else {
      conversaciones.value = [];
    }
  } catch (e) {
    console.error('Error cargando conversaciones:', e);
    conversaciones.value = [];
  }
};

const seleccionarProyecto = (proyecto: Proyecto) => {
  proyectoActual.value = proyecto;
  cargarConversacionesArea(proyecto.id);
};

const usarPrompt = (prompt: string) => {
  mensaje.value = prompt;
  inputRef.value?.focus();
};

const crearNuevoProyecto = () => {
  nuevaAreaNombre.value = '';
  nuevaAreaDescripcion.value = '';
  mostrarModalNuevaArea.value = true;
};

const guardarNuevaArea = () => {
  if (!nuevaAreaNombre.value.trim()) return;

  const idUnico = 'area_' + Date.now();
  const nuevoProyecto: Proyecto = {
    id: idUnico,
    nombre: nuevaAreaNombre.value,
    descripcion: nuevaAreaDescripcion.value || 'Área de vida',
    icono: leafOutline,
    conversaciones: 0,
    accionesPendientes: 0,
    bienvenida: `Hablemos de ${nuevaAreaNombre.value}. ¿Qué tienes en la mente?`,
    prompts: [
      'Quiero reflexionar sobre esto',
      'Necesito orientación',
      '¿Qué me recomiendas?'
    ]
  };

  proyectos.value.push(nuevoProyecto);

  const storedAreas = localStorage.getItem('copilotoAreas');
  const areas: Proyecto[] = storedAreas ? JSON.parse(storedAreas) : [];
  areas.push(nuevoProyecto);
  localStorage.setItem('copilotoAreas', JSON.stringify(areas));

  mostrarModalNuevaArea.value = false;
  seleccionarProyecto(nuevoProyecto);
};

const cargarAreasPersonalizadas = () => {
  const storedAreas = localStorage.getItem('copilotoAreas');
  if (storedAreas) {
    try {
      const areas: Proyecto[] = JSON.parse(storedAreas);
      areas.forEach(area => {
        if (!proyectos.value.find(p => p.id === area.id)) {
          proyectos.value.push(area);
        }
      });
    } catch (e) {
      console.error('Error cargando áreas:', e);
    }
  }
};

const parsearRespuestaCopiloto = (respuesta: string) => {
  let reflejo = '';
  let sabiduria = '';
  let acciones: string[] = [];
  let intensidad = 5;
  let categoria = 'bienestar';

  // 1. Extraer intensidad y categoría
  const intensidadMatch = respuesta.match(/\[intensidad:\s*(\d+)\]/i);
  if (intensidadMatch) {
    intensidad = parseInt(intensidadMatch[1]);
  }

  const categoriaMatch = respuesta.match(/\[categoria:\s*(\w+)\]/i);
  if (categoriaMatch) {
    categoria = categoriaMatch[1].toLowerCase();
  }

  // 2. Extraer Reflejo (con o sin etiqueta)
  const reflejoMatch = respuesta.match(/(?:REFLEJO:|PRIMERO - REFLEJO:)\s*([\s\S]*?)(?=\n\n|\n-|$|---|\nSABIDUR|SEGUNDO - SABIDUR)/i);
  if (reflejoMatch) {
    reflejo = reflejoMatch[1].trim();
  } else {
    // Si no hay etiqueta, intentar tomar el primer párrafo largo
    const parrafos = respuesta.split('\n\n').filter(p => p.trim().length > 30 && !p.includes('[') && !p.match(/^\d[\.\)]/));
    if (parrafos.length > 0) {
      reflejo = parrafos[0].trim();
    }
  }

  // 3. Extraer Sabiduría (con o sin etiqueta)
  const sabiduriaMatch = respuesta.match(/(?:SABIDURÍA:|SEGUNDO - SABIDURÍA:)\s*([\s\S]*?)(?=\n\n|\n-|$|---|\nACCIONE|Traqui)/i);
  if (sabiduriaMatch) {
    sabiduria = sabiduriaMatch[1].trim();
  } else if (respuesta.toLowerCase().includes('sabidur') || respuesta.toLowerCase().includes('reflexi')) {
    const sabMatchFallback = respuesta.match(/(?:sabidur|reflexi)[^a-z\n]*(.*?)(?=\n|Traqui|---)/is);
    if (sabMatchFallback) {
      sabiduria = sabMatchFallback[1].trim();
    }
  }

  // 4. Extraer Acciones
  const accionMatches = respuesta.match(/\d+[\.\)]\s*([^\n]+)/g);
  if (accionMatches) {
    acciones = accionMatches
      .map(m => m.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(a => a.length > 5 && !a.includes('---') && !a.includes('[') && !a.toLowerCase().includes('reflejo') && !a.toLowerCase().includes('sabidur'))
      .slice(0, 4);
  }

  let textoCombinado = '';
  if (reflejo) textoCombinado += reflejo + '\n\n';
  if (sabiduria) textoCombinado += sabiduria + '\n\n';

  if (!textoCombinado.trim()) {
    textoCombinado = respuesta.split('---')[0]?.trim() || respuesta;
  }

  return {
    texto: textoCombinado,
    reflejo,
    sabiduria,
    acciones,
    intensidad,
    categoria
  };
};

const enviarMensaje = async () => {
  if (!mensaje.value.trim() || cargando.value) return;

  const ahora = new Date();
  const hora = ahora.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });

  const mensajeUsuario: Mensaje = {
    tipo: 'usuario',
    texto: mensaje.value,
    hora
  };

  conversaciones.value.push(mensajeUsuario);
  const textoUsuario = mensaje.value;
  mensaje.value = '';
  if (inputRef.value) {
    inputRef.value.style.height = 'auto';
  }
  cargando.value = true;

  await nextTick();
  scrollToBottom();

  const areaMapeo: Record<string, string> = {
    'finanzas': 'finanzas',
    'relaciones': 'relaciones',
    'trabajo': 'trabajo',
    'fe': 'fe',
    'espiritualidad': 'fe',
    'metas': 'metas',
    'salud': 'bienestar',
    'bienestar': 'bienestar'
  };

  const categoriaApi = areaMapeo[proyectoActual.value?.id || 'bienestar'] || 'bienestar';
  const areaApi = proyectoActual.value?.id || 'bienestar';

  try {
    console.log('Enviando mensaje a API:', textoUsuario, categoriaApi);

    const response = await llmService.copilotoEmocional(
      textoUsuario,
      categoriaApi,
      currentUser.value?.id,
      areaApi,
      sessionId.value
    );

    console.log('Response API:', JSON.stringify(response));
    console.log('Response keys:', Object.keys(response));
    const respuestaTexto = response.data?.respuesta || response.data?.data?.respuesta || response.data?.contenido || response || response.respuesta || 'Entiendo lo que me dices.';
    console.log('Respuesta texto:', respuestaTexto.substring(0, 500));
    const { texto, acciones, intensidad, reflejo, sabiduria } = parsearRespuestaCopiloto(respuestaTexto);
    console.log('Parser result:', { texto, reflejo, sabiduria, acciones });

    const mensajesIntensidad = {
      baja: 'Esta bien tomar un respiro. Estas en el camino correcto.',
      media: 'Aprecio que me cuentes esto. Vamos a trabajar en ello juntos.',
      alta: 'Eso suena realmente dificil. Estoy aqui para ayudarte.',
      critica: 'Oye, lo que me estas contando suena muy pesado. No tenes que cargarlo solo.'
    };

    let mensajeIntensidad = mensajesIntensidad.media;
    if (intensidad >= 9) mensajeIntensidad = mensajesIntensidad.critica;
    else if (intensidad >= 7) mensajeIntensidad = mensajesIntensidad.alta;
    else if (intensidad <= 3) mensajeIntensidad = mensajesIntensidad.baja;

    const respuestaAI: Mensaje = {
      tipo: 'ai',
      texto: texto || mensajeIntensidad,
      reflejo: reflejo || '',
      sabiduria: sabiduria || '',
      hora: new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }),
      recomendacion: acciones.length > 0 ? {
        texto: `Te sugiero estas ${acciones.length} acciones para esta semana:`,
        acciones: acciones
      } : undefined,
      intensidad
    };

    conversaciones.value.push(respuestaAI);
  } catch (error: any) {
    console.error('Error en copilotoEmocional:', error);
    console.error('Error message:', error.message);
    console.error('Error response:', error.response);
    const respuestaError: Mensaje = {
      tipo: 'ai',
      texto: 'Gracias por compartir eso. Cuentame mas sobre como te sientes respecto a esta situacion.',
      hora: new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }),
      recomendacion: {
        texto: 'Te sugiero que dediques unos minutos hoy a reflexionar sobre esto.',
        acciones: ['Escribir tus pensamientos', 'Tomar una pausa', 'Respirar profundamente']
      }
    };
    conversaciones.value.push(respuestaError);
  }

  cargando.value = false;
  await nextTick();
  scrollToBottom();
};

const generarIdTemporal = () => {
  return Math.floor(Math.random() * 1000000) + 1;
};

const aceptarAccion = async (accion: string, msg: Mensaje) => {
  if (!currentUser.value) {
    return;
  }

  const urgenciaMapeo: Record<string, string> = {
    'Hoy': 'hoy',
    'Mañana': 'manana',
    'Esta semana': 'esta_semana'
  };

  try {
    const result = await llmService.createAction(
      currentUser.value.id,
      proyectoActual.value?.id || 'General',
      'Nueva acción',
      accion,
      'hoy'
    );

    if (result.success && result.data) {
      accionesGlobales.value.unshift({
        id: result.data.id,
        titulo: result.data.title || 'Nueva acción',
        descripcion: result.data.description || accion,
        proyecto: proyectoActual.value?.nombre || 'General',
        fecha: result.data.urgency === 'hoy' ? 'Hoy' : result.data.urgency === 'manana' ? 'Mañana' : 'Esta semana',
        completada: false
      });
    } else {
      accionesGlobales.value.unshift({
        id: -generarIdTemporal(),
        titulo: 'Nueva acción',
        descripcion: accion,
        proyecto: proyectoActual.value?.nombre || 'General',
        fecha: 'Hoy',
        completada: false
      });
    }
  } catch (e) {
    console.error('Error guardando acción:', e);
    accionesGlobales.value.unshift({
      id: -generarIdTemporal(),
      titulo: 'Nueva acción',
      descripcion: accion,
      proyecto: proyectoActual.value?.nombre || 'General',
      fecha: 'Hoy',
      completada: false
    });
  }
};

const toggleAccion = async (accion: Accion) => {
  if (!currentUser.value) return;

  if (accion.id < 0) {
    accion.completada = !accion.completada;
    return;
  }

  try {
    const result = await llmService.toggleAction(accion.id, currentUser.value.id);
    if (result.success) {
      accion.completada = !accion.completada;
    }
  } catch (e) {
    console.error('Error toggling action:', e);
  }
};

const abrirEdicion = (accion: Accion) => {
  accionEditando.value = accion;
  accionEditada.value = {
    titulo: accion.titulo,
    descripcion: accion.descripcion,
    proyecto: accion.proyecto,
    fecha: accion.fecha
  };
  mostrarModalEdicion.value = true;
};

const guardarEdicion = async () => {
  if (!accionEditando.value || !currentUser.value) return;

  if (accionEditando.value.id < 0) {
    accionEditando.value.titulo = accionEditada.value.titulo;
    accionEditando.value.descripcion = accionEditada.value.descripcion;
    accionEditando.value.proyecto = accionEditada.value.proyecto;
    accionEditando.value.fecha = accionEditada.value.fecha;
    mostrarModalEdicion.value = false;
    return;
  }

  try {
    const urgencyMap: Record<string, string> = {
      'Hoy': 'hoy',
      'Mañana': 'manana',
      'Esta semana': 'esta_semana'
    };

    const result = await llmService.updateAction(
      accionEditando.value.id,
      currentUser.value.id,
      {
        title: accionEditada.value.titulo,
        description: accionEditada.value.descripcion,
        urgency: urgencyMap[accionEditada.value.fecha],
        area: accionEditada.value.proyecto
      }
    );

    if (result.success) {
      accionEditando.value.titulo = accionEditada.value.titulo;
      accionEditando.value.descripcion = accionEditada.value.descripcion;
      accionEditando.value.proyecto = accionEditada.value.proyecto;
      accionEditando.value.fecha = accionEditada.value.fecha;
      mostrarModalEdicion.value = false;
    }
  } catch (e) {
    console.error('Error guardando edición:', e);
  }
};

const eliminarAccion = async (accion: Accion) => {
  if (!currentUser.value) return;

  if (accion.id < 0) {
    accionesGlobales.value = accionesGlobales.value.filter(a => a.id !== accion.id);
    return;
  }

  try {
    const result = await llmService.deleteAction(accion.id, currentUser.value.id);
    if (result.success) {
      accionesGlobales.value = accionesGlobales.value.filter(a => a.id !== accion.id);
    }
  } catch (e) {
    console.error('Error eliminando acción:', e);
  }
};

const eliminarYCerrar = async () => {
  if (accionEditando.value) {
    await eliminarAccion(accionEditando.value);
    mostrarModalEdicion.value = false;
  }
};

const toggleVoice = () => {
  grabando.value = !grabando.value;
  if (grabando.value) {
    setTimeout(() => {
      grabando.value = false;
      mensaje.value = 'Estoy bien, solo necesitaba desahogarme';
      enviarMensaje();
    }, 2000);
  }
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const hablarConCopiloto = () => {
  mostrarCrisis.value = false;
  mensaje.value = 'Necesito hablar con alguien';
  enviarMensaje();
};

onMounted(() => {
  checkStoredSession();
  cargarAreasPersonalizadas();
  if (proyectos.value.length > 0) {
    proyectoActual.value = proyectos.value[0];
  }
  scrollToBottom();
});
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  background: #f8fafc;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.breadcrumb-search {
  display: flex;
  align-items: center;
  gap: 24px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #64748b;
}

.breadcrumb .current {
  color: #1e293b;
  font-weight: 600;
}

.breadcrumb ion-icon {
  font-size: 14px;
  color: #94a3b8;
}

.btn-crisis {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-crisis:hover {
  background: #dc2626;
  transform: scale(1.02);
}

.btn-analisis {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-analisis:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-user {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-user:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-user ion-icon {
  font-size: 18px;
}

.content-area {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.projects-sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.projects-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.project-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 4px;
}

.project-item:hover {
  background: #f1f5f9;
}

.project-item.active {
  background: #e0f2fe;
}

.project-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-icon.finanzas {
  background: #dcfce7;
  color: #16a34a;
}

.project-icon.relaciones {
  background: #fce7f3;
  color: #db2777;
}

.project-icon.trabajo {
  background: #dbeafe;
  color: #2563eb;
}

.project-icon.fe {
  background: #fef3c7;
  color: #d97706;
}

.project-icon.metas {
  background: #e0e7ff;
  color: #4f46e5;
}

.project-icon.salud {
  background: #f0fdf4;
  color: #16a34a;
}

.project-icon ion-icon {
  font-size: 20px;
}

.project-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.project-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.project-stats {
  font-size: 12px;
  color: #64748b;
}

.project-progress {
  display: flex;
  align-items: center;
}

.pending-badge {
  background: #f59e0b;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #e2e8f0;
}

.btn-new-project {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: #f1f5f9;
  border: 2px dashed #cbd5e1;
  border-radius: 10px;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-new-project:hover {
  background: #e2e8f0;
  border-color: #94a3b8;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.chat-project-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.project-icon-small {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-icon-small.finanzas {
  background: #dcfce7;
  color: #16a34a;
}

.project-icon-small.relaciones {
  background: #fce7f3;
  color: #db2777;
}

.project-icon-small.trabajo {
  background: #dbeafe;
  color: #2563eb;
}

.project-icon-small.fe {
  background: #fef3c7;
  color: #d97706;
}

.project-icon-small.metas {
  background: #e0e7ff;
  color: #4f46e5;
}

.project-icon-small.salud {
  background: #f0fdf4;
  color: #16a34a;
}

.project-icon-small ion-icon {
  font-size: 22px;
}

.project-details h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.project-details span {
  font-size: 13px;
  color: #64748b;
}

.chat-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.icon-btn .badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #f59e0b;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
}

.chat-messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.welcome-message {
  text-align: center;
  padding: 40px 20px;
  max-width: 500px;
  margin: auto;
}

.welcome-icon {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.3);
}

.welcome-icon ion-icon {
  font-size: 36px;
  color: white;
}

.welcome-message h2 {
  color: #1e293b;
  margin-bottom: 12px;
  font-size: 22px;
}

.welcome-message p {
  color: #64748b;
  line-height: 1.6;
  font-size: 15px;
}

.quick-prompts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 24px;
}

.prompt-btn {
  padding: 10px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  color: #475569;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.prompt-btn:hover {
  background: #0ea5e9;
  color: white;
  border-color: #0ea5e9;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 75%;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-message .message-avatar {
  background: #0ea5e9;
}

.ai-message .message-avatar {
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
}

.message-avatar ion-icon {
  font-size: 18px;
  color: white;
}

.message-content {
  background: white;
  padding: 14px 18px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative;
}

.user-message .message-content {
  background: #0ea5e9;
  color: white;
}

.message-content p {
  margin: 0;
  line-height: 1.6;
  font-size: 14px;
}

.message-time {
  display: block;
  font-size: 11px;
  color: #94a3b8;
  margin-top: 8px;
}

.user-message .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.reflejo-card {
  background: linear-gradient(135deg, #fce7f3, #fbcfe8);
  border: 1px solid #f9a8d4;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 10px;
  text-align: left;
}

.reflejo-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  color: #be185d;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.reflejo-header ion-icon {
  font-size: 14px;
}

.reflejo-card p {
  color: #831843;
  font-size: 15px;
  line-height: 1.5;
  font-style: italic;
}

.sabiduria-card {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border: 1px solid #93c5fd;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 10px;
  text-align: left;
}

.sabiduria-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.sabiduria-header ion-icon {
  font-size: 14px;
}

.sabiduria-card p {
  color: #1e3a8a;
  font-size: 14px;
  line-height: 1.5;
}

.recommendation-card {
  background: linear-gradient(135deg, #fefce8, #fef9c3);
  border: 1px solid #fef08a;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 10px;
  text-align: left;
}

.rec-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  color: #a16207;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.rec-header ion-icon {
  font-size: 14px;
}

.recommendation-card p {
  color: #713f12;
  font-size: 15px;
  line-height: 1.5;
  text-align: left;
}

.rec-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.rec-action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  background: white;
  border: 1px solid #fde047;
  border-radius: 16px;
  color: #a16207;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.rec-action-btn:hover {
  background: #fef08a;
}

.rec-action-btn ion-icon {
  font-size: 12px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: white;
  border-radius: 16px;
  width: fit-content;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #94a3b8;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {

  0%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-8px);
  }
}

.chat-input-area {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  background: white;
  border-top: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 12px 20px;
  transition: border-color 0.2s;
}

.input-wrapper:focus-within {
  border-color: #0ea5e9;
}

.input-wrapper textarea {
  flex: 1;
  border: none;
  background: transparent;
  resize: none;
  outline: none;
  font-size: 15px;
  font-family: inherit;
  max-height: 150px;
  line-height: 1.5;
  color: #1e293b;
  min-height: 24px;
}

.input-wrapper textarea::placeholder {
  color: #94a3b8;
}

.btn-voice {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
}

.btn-voice:hover {
  background: #e2e8f0;
}

.btn-voice ion-icon {
  font-size: 20px;
  color: #64748b;
}

.btn-voice.recording ion-icon {
  color: #ef4444;
  animation: pulse 1s infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.btn-send {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.btn-send:hover:not(:disabled) {
  transform: scale(1.05);
}

.btn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-send ion-icon {
  font-size: 20px;
}

.actions-sidebar {
  width: 300px;
  background: white;
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.actions-sidebar .sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.actions-sidebar .sidebar-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.actions-sidebar .sidebar-header button {
  background: #f1f5f9;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  color: #64748b;
  transition: all 0.2s;
}

.actions-sidebar .sidebar-header button:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.actions-view-toggle {
  display: flex;
  padding: 12px;
  gap: 8px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.actions-view-toggle button {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.actions-view-toggle button:hover {
  border-color: #cbd5e1;
  color: #475569;
}

.actions-view-toggle button.active {
  background: #0ea5e9;
  color: white;
  border-color: #0ea5e9;
  box-shadow: 0 2px 4px rgba(14, 165, 233, 0.3);
}

.actions-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  background: #fafbfc;
}

.action-options {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.btn-edit,
.btn-delete {
  width: 32px;
  height: 32px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: opacity 0.2s;
}

.btn-edit {
  background: #3b82f6;
  color: white;
}

.btn-edit:hover {
  opacity: 0.8;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  opacity: 0.8;
}

.action-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 10px;
  transition: all 0.2s;
  position: relative;
  background: white;
  border: 1px solid #e2e8f0;
}

.action-item:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateX(2px);
}

.action-item.completed {
  opacity: 0.6;
  background: #f8fafc;
}

.action-item.completed .action-title {
  text-decoration: line-through;
  color: #94a3b8;
}

.action-item.urgencia-hoy {
  border-left: 3px solid #ef4444;
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.08), white);
}

.action-item.urgencia-manana {
  border-left: 3px solid #f59e0b;
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.08), white);
}

.action-item.urgencia-semana {
  border-left: 3px solid #22c55e;
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.08), white);
}

.action-item.area-finanzas {
  border-left: 3px solid #16a34a;
  background: linear-gradient(90deg, rgba(22, 163, 74, 0.08), white);
}

.action-item.area-relaciones {
  border-left: 3px solid #db2777;
  background: linear-gradient(90deg, rgba(219, 39, 119, 0.08), white);
}

.action-item.area-trabajo {
  border-left: 3px solid #2563eb;
  background: linear-gradient(90deg, rgba(37, 99, 235, 0.08), white);
}

.action-item.area-fe {
  border-left: 3px solid #d97706;
  background: linear-gradient(90deg, rgba(217, 119, 6, 0.08), white);
}

.action-item.area-metas {
  border-left: 3px solid #4f46e5;
  background: linear-gradient(90deg, rgba(79, 70, 229, 0.08), white);
}

.action-item.area-salud {
  border-left: 3px solid #0891b2;
  background: linear-gradient(90deg, rgba(8, 145, 178, 0.08), white);
}

.accion-proyecto.finanzas-text {
  color: #16a34a;
}

.accion-proyecto.relaciones-text {
  color: #db2777;
}

.accion-proyecto.trabajo-text {
  color: #2563eb;
}

.accion-proyecto.fe-text {
  color: #d97706;
}

.accion-proyecto.metas-text {
  color: #4f46e5;
}

.accion-proyecto.salud-text {
  color: #0891b2;
}

.accion-proyecto.bienestar-text {
  color: #0891b2;
}

.accion-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;
}

.accion-proyecto {
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
}

.accion-fecha {
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
}

.fecha-hoy {
  background: #fee2e2;
  color: #dc2626;
}

.fecha-manana {
  background: #fef3c7;
  color: #d97706;
}

.fecha-esta-semana {
  background: #dcfce7;
  color: #16a34a;
}

.checkbox {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: #cbd5e1;
  border-radius: 6px;
  transition: all 0.2s;
}

.checkbox:hover {
  color: #0ea5e9;
  background: #f0f9ff;
}

.action-item.completed .checkbox {
  color: #22c55e;
  background: #f0fdf4;
}

.action-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.action-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  display: block;
  line-height: 1.4;
}

.action-description {
  font-size: 12px;
  color: #64748b;
  display: block;
  margin-top: 4px;
  line-height: 1.5;
}

.action-meta {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}

.empty-actions {
  text-align: center;
  padding: 48px 24px;
  color: #94a3b8;
}

.empty-actions ion-icon {
  font-size: 56px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-actions p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

.dashboard-modal {
  padding: 24px;
  background: white;
  height: 100%;
  overflow-y: auto;
  max-width: 600px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-header h2 {
  margin: 0;
  color: #1e293b;
  font-size: 20px;
}

.dashboard-header button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.kpi-card {
  background: #f8fafc;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #e0f2fe;
  color: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-icon.green {
  background: #dcfce7;
  color: #16a34a;
}

.kpi-icon.yellow {
  background: #fef3c7;
  color: #d97706;
}

.kpi-icon.purple {
  background: #e0e7ff;
  color: #4f46e5;
}

.kpi-icon ion-icon {
  font-size: 24px;
}

.kpi-data {
  display: flex;
  flex-direction: column;
}

.kpi-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.kpi-label {
  font-size: 12px;
  color: #64748b;
}

.chart-section,
.recommendations-section {
  background: #f8fafc;
  border-radius: 14px;
  padding: 20px;
}

.chart-section h3,
.recommendations-section h3 {
  margin: 0 0 16px;
  font-size: 14px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-label {
  font-size: 12px;
  color: #64748b;
  min-width: 80px;
}

.bar-track {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.bar-fill.finanzas {
  background: #22c55e;
}

.bar-fill.relaciones {
  background: #ec4899;
}

.bar-fill.trabajo {
  background: #3b82f6;
}

.bar-fill.fe {
  background: #f59e0b;
}

.bar-fill.metas {
  background: #6366f1;
}

.bar-fill.salud {
  background: #14b8a6;
}

.bar-value {
  font-size: 12px;
  color: #64748b;
  min-width: 24px;
  text-align: right;
}

.rec-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 10px;
  margin-bottom: 8px;
}

.rec-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rec-icon.finanzas {
  background: #dcfce7;
  color: #16a34a;
}

.rec-icon.relaciones {
  background: #fce7f3;
  color: #db2777;
}

.rec-icon.trabajo {
  background: #dbeafe;
  color: #2563eb;
}

.rec-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.rec-title {
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
}

.rec-area {
  font-size: 12px;
  color: #64748b;
}

.rec-status {
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 12px;
}

.rec-status.pendiente {
  background: #fef3c7;
  color: #d97706;
}

.rec-status.en_progreso {
  background: #dbeafe;
  color: #2563eb;
}

.rec-status.completada {
  background: #dcfce7;
  color: #16a34a;
}

.insight-section {
  margin-top: 8px;
}

.insight-card {
  background: linear-gradient(135deg, #e0f2fe, #cffafe);
  border: 1px solid #a5f3fc;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  gap: 12px;
}

.insight-card ion-icon {
  font-size: 24px;
  color: #0891b2;
}

.insight-content h4 {
  margin: 0 0 4px;
  font-size: 14px;
  color: #164e63;
}

.insight-content p {
  margin: 0;
  font-size: 13px;
  color: #164e63;
  line-height: 1.5;
}

.crisis-modal {
  padding: 40px 24px;
  background: white;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.crisis-content {
  text-align: center;
  max-width: 400px;
}

.crisis-icon {
  width: 80px;
  height: 80px;
  background: #fee2e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.crisis-icon ion-icon {
  font-size: 40px;
  color: #ef4444;
}

.crisis-content h2 {
  color: #1e293b;
  margin-bottom: 12px;
}

.crisis-content p {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 24px;
}

.crisis-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.crisis-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.crisis-btn.primary {
  background: #ef4444;
  color: white;
}

.crisis-btn.primary:hover {
  background: #dc2626;
}

.crisis-btn.secondary {
  background: #f1f5f9;
  color: #1e293b;
}

.crisis-btn.secondary:hover {
  background: #e2e8f0;
}

.crisis-btn small {
  font-size: 12px;
  opacity: 0.8;
}

.crisis-tips {
  text-align: left;
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
}

.crisis-tips h4 {
  margin: 0 0 12px;
  font-size: 14px;
  color: #64748b;
}

.crisis-tips ul {
  margin: 0;
  padding-left: 20px;
  color: #64748b;
  font-size: 14px;
}

.crisis-tips li {
  margin-bottom: 6px;
}

.edit-action-modal {
  background: white;
  height: 100%;
  max-width: 520px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
}

.modal-drag-handle {
  width: 40px;
  height: 5px;
  background: #e2e8f0;
  border-radius: 3px;
  margin: 10px auto;
  flex-shrink: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 20px 16px;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.header-icon ion-icon {
  font-size: 20px;
  color: white;
}

.header-text h2 {
  margin: 0;
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
}

.header-subtitle {
  margin: 2px 0 0;
  color: #64748b;
  font-size: 12px;
}

.close-btn {
  background: #f1f5f9;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 10px;
  color: #64748b;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.close-btn ion-icon {
  font-size: 20px;
}

.modal-preview {
  padding: 0 20px 16px;
  flex-shrink: 0;
}

.preview-label {
  font-size: 11px;
  font-weight: 500;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.preview-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.preview-checkbox {
  width: 22px;
  height: 22px;
  border: 2px solid #cbd5e1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.preview-checkbox ion-icon {
  font-size: 14px;
}

.preview-content {
  flex: 1;
  min-width: 0;
}

.preview-title {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
  font-size: 11px;
}

.preview-area {
  color: #64748b;
}

.preview-dot {
  color: #cbd5e1;
}

.preview-date {
  font-weight: 500;
}

.preview-date.urgency-hoy {
  color: #ef4444;
}

.preview-date.urgency-manana {
  color: #f59e0b;
}

.preview-date.urgency-esta-semana {
  color: #22c55e;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
}

.form-section {
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 14px;
}

.section-title ion-icon {
  font-size: 16px;
  color: #0ea5e9;
}

.form-group {
  margin-bottom: 16px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-group label ion-icon {
  font-size: 14px;
  color: #0ea5e9;
  margin-right: 6px;
}

.char-count {
  font-size: 11px;
  font-weight: 400;
  color: #94a3b8;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  background: #fafbfc;
  font-family: inherit;
  transition: all 0.2s;
  color: #1e293b;
  box-sizing: border-box;
}

.input-title {
  font-weight: 500;
}

.input-description {
  resize: none;
  line-height: 1.5;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #94a3b8;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0ea5e9;
  background: white;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.area-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.area-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.area-option:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.area-option.selected {
  border-color: #0ea5e9;
  background: #f0f9ff;
}

.area-option ion-icon {
  font-size: 20px;
}

.area-option span {
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
}

.area-option.selected span {
  color: #0ea5e9;
}

.area-option.finanzas ion-icon {
  color: #16a34a;
}

.area-option.relaciones ion-icon {
  color: #db2777;
}

.area-option.trabajo ion-icon {
  color: #2563eb;
}

.area-option.fe ion-icon {
  color: #d97706;
}

.area-option.metas ion-icon {
  color: #4f46e5;
}

.area-option.salud ion-icon {
  color: #16a34a;
}

.area-option.finanzas.selected {
  background: #f0fdf4;
  border-color: #16a34a;
}

.area-option.relaciones.selected {
  background: #fdf2f8;
  border-color: #db2777;
}

.area-option.trabajo.selected {
  background: #eff6ff;
  border-color: #2563eb;
}

.area-option.fe.selected {
  background: #fffbeb;
  border-color: #d97706;
}

.area-option.metas.selected {
  background: #eef2ff;
  border-color: #4f46e5;
}

.area-option.salud.selected {
  background: #f0fdf4;
  border-color: #16a34a;
}

.date-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.date-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 14px 10px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.date-option:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.date-option.selected {
  color: white;
}

.date-option.selected .date-label {
  color: white;
}

.date-option.selected .date-desc {
  color: rgba(255, 255, 255, 0.8);
}

.date-option.urgency-hoy.selected {
  background: #ef4444;
  border-color: #ef4444;
}

.date-option.urgency-manana.selected {
  background: #f59e0b;
  border-color: #f59e0b;
}

.date-option.urgency-semana.selected {
  background: #22c55e;
  border-color: #22c55e;
}

.date-label {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}

.date-desc {
  font-size: 10px;
  color: #94a3b8;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid #f1f5f9;
  background: white;
  flex-shrink: 0;
  gap: 12px;
}

.footer-spacer {
  width: 80px;
}

.btn-delete-action {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: transparent;
  border: 1.5px solid #fecaca;
  border-radius: 10px;
  color: #ef4444;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-delete-action:hover {
  background: #fef2f2;
  border-color: #ef4444;
}

.btn-delete-action ion-icon {
  font-size: 16px;
}

.footer-actions {
  display: flex;
  gap: 10px;
  flex: 1;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 12px 20px;
  background: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.btn-save {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.btn-save:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

.btn-save ion-icon {
  font-size: 18px;
}

.new-area-modal {
  background: white;
  height: 100%;
  max-width: 450px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  border-radius: 20px 20px 0 0;
}

.new-area-modal .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.new-area-modal .header-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.new-area-modal .header-icon.new-area {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.new-area-modal .header-icon.new-area ion-icon {
  font-size: 22px;
  color: white;
}

.new-area-modal h2 {
  margin: 0;
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
}

.new-area-modal .header-subtitle {
  margin: 2px 0 0;
  color: #64748b;
  font-size: 13px;
}

.new-area-modal .modal-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.new-area-modal .form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.new-area-modal .form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.new-area-modal .form-group input,
.new-area-modal .form-group textarea {
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  background: #f8fafc;
  font-family: inherit;
  transition: all 0.2s;
  color: #1e293b;
}

.new-area-modal .form-group input:focus,
.new-area-modal .form-group textarea:focus {
  outline: none;
  border-color: #22c55e;
  background: white;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
}

.new-area-modal .btn-create-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.new-area-modal .btn-create-area:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
}

.new-area-modal .btn-create-area:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.new-area-modal .btn-create-area ion-icon {
  font-size: 18px;
}

/* Dark Mode */
.dark .layout-container {
  background: #111827;
}

.dark .breadcrumb {
  color: #9ca3af;
}

.dark .breadcrumb .current {
  color: #f3f4f6;
}

.dark .projects-sidebar {
  background: #1f2937;
  border-right-color: #374151;
}

.dark .sidebar-header {
  border-bottom-color: #374151;
}

.dark .sidebar-header h3 {
  color: #9ca3af;
}

.dark .project-item:hover {
  background: #374151;
}

.dark .project-item.active {
  background: #1e3a5f;
}

.dark .project-name {
  color: #f3f4f6;
}

.dark .project-stats {
  color: #9ca3af;
}

.dark .btn-new-project {
  background: #374151;
  border-color: #4b5563;
  color: #9ca3af;
}

.dark .btn-new-project:hover {
  background: #4b5563;
}

.dark .chat-container {
  background: linear-gradient(180deg, #111827 0%, #1f2937 100%);
}

.dark .chat-header {
  background: #1f2937;
  border-bottom-color: #374151;
}

.dark .project-details h3 {
  color: #f3f4f6;
}

.dark .project-details span {
  color: #9ca3af;
}

.dark .icon-btn {
  background: #374151;
  color: #9ca3af;
}

.dark .icon-btn:hover {
  background: #4b5563;
  color: #f3f4f6;
}

.dark .welcome-message h2 {
  color: #f3f4f6;
}

.dark .welcome-message p {
  color: #9ca3af;
}

.dark .prompt-btn {
  background: #1f2937;
  border-color: #374151;
  color: #d1d5db;
}

.dark .prompt-btn:hover {
  background: #0ea5e9;
}

.dark .message-content {
  background: #1f2937;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark .message-content p {
  color: #d1d5db;
}

.dark .message-time {
  color: #6b7280;
}

.dark .reflejo-card {
  background: linear-gradient(135deg, #4c1d34, #701a44);
  border-color: #be185d;
}

.dark .reflejo-header {
  color: #f9a8d4;
}

.dark .reflejo-card p {
  color: #e5e7eb;
}

.dark .sabiduria-card {
  background: linear-gradient(135deg, #1e3a5f, #1e40af);
  border-color: #3b82f6;
}

.dark .sabiduria-header {
  color: #93c5fd;
}

.dark .sabiduria-card p {
  color: #dbeafe;
}

.dark .recommendation-card {
  background: linear-gradient(135deg, #422006, #713f12);
  border-color: #f59e0b;
}

.dark .rec-header {
  color: #fcd34d;
}

.dark .recommendation-card p {
  color: #fef3c7;
}

.dark .rec-action-btn {
  background: #1f2937;
  border-color: #f59e0b;
  color: #fef3c7;
}

.dark .typing-indicator {
  background: #1f2937;
}

.dark .typing-indicator span {
  background: #6b7280;
}

.dark .chat-input-area {
  background: #1f2937;
  border-top-color: #374151;
}

.dark .input-wrapper {
  background: #374151;
  border-color: #4b5563;
}

.dark .input-wrapper textarea {
  color: #f3f4f6;
}

.dark .input-wrapper textarea::placeholder {
  color: #6b7280;
}

.dark .btn-voice ion-icon {
  color: #9ca3af;
}

.dark .btn-voice:hover {
  background: #4b5563;
}

.dark .actions-sidebar {
  background: #1f2937;
  border-left-color: #374151;
}

.dark .actions-sidebar .sidebar-header h3 {
  color: #f3f4f6;
}

.dark .actions-sidebar .sidebar-header button {
  color: #9ca3af;
}

.dark .actions-sidebar .sidebar-header button:hover {
  color: #f3f4f6;
}

.dark .actions-view-toggle {
  border-bottom-color: #374151;
}

.dark .actions-view-toggle button {
  background: #374151;
  border-color: #4b5563;
  color: #9ca3af;
}

.dark .actions-view-toggle button.active {
  background: #0ea5e9;
  border-color: #0ea5e9;
  color: white;
}

.dark .actions-list {
  background: #1f2937;
}

.dark .action-item {
  background: #374151;
}

.dark .action-item:hover {
  background: #4b5563;
}

.dark .action-item.completed {
  opacity: 0.5;
}

.dark .action-item.urgencia-hoy {
  border-left-color: #ef4444;
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.15), transparent);
}

.dark .action-item.urgencia-manana {
  border-left-color: #f59e0b;
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.15), transparent);
}

.dark .action-item.urgencia-semana {
  border-left-color: #22c55e;
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.15), transparent);
}

.dark .action-item.area-finanzas {
  border-left-color: #22c55e;
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.15), transparent);
}

.dark .action-item.area-relaciones {
  border-left-color: #ec4899;
  background: linear-gradient(90deg, rgba(236, 72, 153, 0.15), transparent);
}

.dark .action-item.area-trabajo {
  border-left-color: #3b82f6;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.15), transparent);
}

.dark .action-item.area-fe {
  border-left-color: #f59e0b;
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.15), transparent);
}

.dark .action-item.area-metas {
  border-left-color: #6366f1;
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.15), transparent);
}

.dark .action-item.area-salud {
  border-left-color: #06b6d4;
  background: linear-gradient(90deg, rgba(6, 182, 212, 0.15), transparent);
}

.dark .accion-proyecto.finanzas-text {
  color: #22c55e;
}

.dark .accion-proyecto.relaciones-text {
  color: #ec4899;
}

.dark .accion-proyecto.trabajo-text {
  color: #3b82f6;
}

.dark .accion-proyecto.fe-text {
  color: #f59e0b;
}

.dark .accion-proyecto.metas-text {
  color: #6366f1;
}

.dark .accion-proyecto.salud-text {
  color: #06b6d4;
}

.dark .accion-proyecto.bienestar-text {
  color: #06b6d4;
}

.dark .action-title {
  color: #f3f4f6;
}

.dark .action-description {
  color: #9ca3af;
}

.dark .accion-meta {
  background: transparent;
}

.dark .accion-proyecto {
  color: #9ca3af;
}

.dark .accion-fecha {
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
}

.dark .fecha-hoy {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

.dark .fecha-manana {
  background: rgba(245, 158, 11, 0.2);
  color: #fcd34d;
}

.dark .fecha-esta-semana {
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
}

.dark .checkbox {
  color: #6b7280;
}

.dark .checkbox:hover {
  color: #38bdf8;
}

.dark .action-item.completed .checkbox {
  color: #22c55e;
}

.dark .empty-actions {
  color: #6b7280;
}

.dark .dashboard-modal {
  background: #1f2937;
}

.dark .dashboard-header h2 {
  color: #f3f4f6;
}

.dark .dashboard-header button {
  color: #9ca3af;
}

.dark .kpi-card {
  background: #374151;
}

.dark .kpi-value {
  color: #f3f4f6;
}

.dark .kpi-label {
  color: #9ca3af;
}

.dark .chart-section,
.dark .recommendations-section {
  background: #374151;
}

.dark .chart-section h3,
.dark .recommendations-section h3 {
  color: #9ca3af;
}

.dark .bar-label {
  color: #9ca3af;
}

.dark .bar-track {
  background: #4b5563;
}

.dark .bar-value {
  color: #9ca3af;
}

.dark .rec-item {
  background: #1f2937;
}

.dark .rec-title {
  color: #f3f4f6;
}

.dark .rec-area {
  color: #9ca3af;
}

.dark .insight-card {
  background: linear-gradient(135deg, #1e3a5f, #164e63);
  border-color: #0891b2;
}

.dark .insight-card ion-icon {
  color: #67e8f9;
}

.dark .insight-content h4 {
  color: #cffafe;
}

.dark .insight-content p {
  color: #cffafe;
}

.dark .crisis-modal {
  background: #1f2937;
}

.dark .crisis-content h2 {
  color: #f3f4f6;
}

.dark .crisis-content p {
  color: #9ca3af;
}

.dark .crisis-btn.secondary {
  background: #374151;
  color: #f3f4f6;
}

.dark .crisis-btn.secondary:hover {
  background: #4b5563;
}

.dark .crisis-tips {
  background: #374151;
}

.dark .crisis-tips h4 {
  color: #9ca3af;
}

.dark .crisis-tips ul {
  color: #9ca3af;
}

.dark .crisis-tips li {
  margin-bottom: 6px;
}

.dark .actions-view-toggle {
  border-bottom-color: #374151;
}

.dark .actions-view-toggle button {
  background: #1f2937;
  border-color: #374151;
  color: #9ca3af;
}

.dark .actions-view-toggle button.active {
  background: #0ea5e9;
  border-color: #0ea5e9;
}

.dark .edit-action-modal {
  background: #1f2937;
}

.dark .modal-drag-handle {
  background: #4b5563;
}

.dark .modal-header {
  border-bottom-color: #374151;
}

.dark .header-icon {
  background: linear-gradient(135deg, #0284c7, #0ea5e9);
}

.dark .header-text h2 {
  color: #f3f4f6;
}

.dark .header-subtitle {
  color: #9ca3af;
}

.dark .close-btn {
  background: #374151;
  color: #9ca3af;
}

.dark .close-btn:hover {
  background: #4b5563;
  color: #f3f4f6;
}

.dark .modal-preview {
  border-bottom-color: #374151;
}

.dark .preview-label {
  color: #6b7280;
}

.dark .preview-card {
  background: #374151;
  border-color: #4b5563;
}

.dark .preview-checkbox {
  border-color: #4b5563;
  color: #6b7280;
}

.dark .preview-title {
  color: #f3f4f6;
}

.dark .preview-area {
  color: #9ca3af;
}

.dark .section-title {
  color: #6b7280;
}

.dark .section-title ion-icon {
  color: #38bdf8;
}

.dark .form-group label {
  color: #d1d5db;
}

.dark .form-group label ion-icon {
  color: #38bdf8;
}

.dark .char-count {
  color: #6b7280;
}

.dark .form-group input,
.dark .form-group textarea {
  background: #374151;
  border-color: #4b5563;
  color: #f3f4f6;
}

.dark .form-group input::placeholder,
.dark .form-group textarea::placeholder {
  color: #6b7280;
}

.dark .form-group input:focus,
.dark .form-group textarea:focus {
  border-color: #0ea5e9;
  background: #1f2937;
}

.dark .area-option {
  background: #374151;
  border-color: #4b5563;
}

.dark .area-option:hover {
  background: #4b5563;
  border-color: #6b7280;
}

.dark .area-option.selected {
  border-color: #0ea5e9;
  background: rgba(14, 165, 233, 0.15);
}

.dark .area-option span {
  color: #9ca3af;
}

.dark .area-option.selected span {
  color: #38bdf8;
}

.dark .area-option.finanzas.selected {
  background: rgba(22, 163, 74, 0.15);
}

.dark .area-option.relaciones.selected {
  background: rgba(219, 39, 119, 0.15);
}

.dark .area-option.trabajo.selected {
  background: rgba(37, 99, 235, 0.15);
}

.dark .area-option.fe.selected {
  background: rgba(217, 119, 6, 0.15);
}

.dark .area-option.metas.selected {
  background: rgba(79, 70, 229, 0.15);
}

.dark .area-option.salud.selected {
  background: rgba(22, 163, 74, 0.15);
}

.dark .date-option {
  background: #374151;
  border-color: #4b5563;
}

.dark .date-option:hover {
  background: #4b5563;
  border-color: #6b7280;
}

.dark .date-label {
  color: #f3f4f6;
}

.dark .date-desc {
  color: #6b7280;
}

.dark .modal-footer {
  border-top-color: #374151;
  background: #1f2937;
}

.dark .btn-delete-action {
  border-color: #7f1d1d;
  color: #f87171;
}

.dark .btn-delete-action:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: #ef4444;
}

.dark .btn-cancel {
  background: #374151;
  color: #9ca3af;
}

.dark .btn-cancel:hover {
  background: #4b5563;
  color: #f3f4f6;
}

.dark .new-area-modal {
  background: #1f2937;
}

.dark .new-area-modal .modal-header {
  border-bottom-color: #374151;
}

.dark .new-area-modal .header-icon.new-area {
  background: linear-gradient(135deg, #16a34a, #22c55e);
}

.dark .new-area-modal h2 {
  color: #f3f4f6;
}

.dark .new-area-modal .header-subtitle {
  color: #9ca3af;
}

.dark .new-area-modal .form-group label {
  color: #d1d5db;
}

.dark .new-area-modal .form-group input,
.dark .new-area-modal .form-group textarea {
  background: #374151;
  border-color: #4b5563;
  color: #f3f4f6;
}

.dark .new-area-modal .form-group input:focus,
.dark .new-area-modal .form-group textarea:focus {
  border-color: #22c55e;
  background: #1f2937;
}
</style>