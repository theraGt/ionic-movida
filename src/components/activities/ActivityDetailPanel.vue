<template>
  <div class="detail-panel" :class="{ 'is-open': isOpen }">
    <div class="panel-backdrop" @click="closePanel"></div>
    
    <div class="panel-content">
      <!-- Header -->
      <div class="panel-header">
        <div class="header-actions">
          <ion-button fill="clear" size="small" @click="closePanel">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </div>
        <div class="type-badge-large" :class="getTipoClass(activity?.tipo)">
          {{ activity?.tipo }}
        </div>
        <h2 class="panel-title">{{ activity?.actividad }}</h2>
        <p class="panel-subtitle">ID: {{ activity?.id }}</p>
      </div>

      <!-- Content -->
      <div class="panel-body">
        <!-- Estado Badge - Editable -->
        <div class="status-section">
          <div class="status-selector" @click="toggleStatusMenu">
            <span class="status-badge" :class="getStatusClass(activity?.estado)">
              {{ activity?.estado }}
            </span>
            <ion-icon :icon="chevronDownOutline" class="status-chevron"></ion-icon>
          </div>
          
          <!-- Menú de estados -->
          <div v-if="showStatusMenu" class="status-menu">
            <div 
              v-for="estado in estadosOptions" 
              :key="estado"
              class="status-option"
              :class="{ 'active': activity?.estado === estado }"
              @click="changeStatus(estado)"
            >
              <span class="status-dot" :class="getStatusClass(estado)"></span>
              <span class="status-text">{{ estado }}</span>
            </div>
          </div>
        </div>

        <!-- Información Principal -->
        <div class="section">
          <h4 class="section-title">Información</h4>
          <div class="info-grid">
            <div class="info-item">
              <ion-icon :icon="calendarOutline" class="info-icon"></ion-icon>
              <div class="info-content">
                <span class="info-label">Fecha</span>
                <span class="info-value">{{ formatDate(activity?.fecha) }}</span>
              </div>
            </div>
            <div class="info-item">
              <ion-icon :icon="timeOutline" class="info-icon"></ion-icon>
              <div class="info-content">
                <span class="info-label">Hora</span>
                <span class="info-value">{{ formatTime(activity?.hora) }}</span>
              </div>
            </div>
            <div class="info-item">
              <ion-icon :icon="flagOutline" class="info-icon"></ion-icon>
              <div class="info-content">
                <span class="info-label">País</span>
                <span class="info-value">{{ activity?.pais }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Comentario -->
        <div class="section" v-if="activity?.comentario">
          <h4 class="section-title">Comentario</h4>
          <p class="description-text">{{ activity?.comentario }}</p>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="panel-footer">
        <ion-button expand="block" fill="outline" color="medium" @click="handleEdit">
          <ion-icon slot="start" :icon="createOutline"></ion-icon>
          Editar
        </ion-button>
        <ion-button expand="block" color="danger" fill="outline" @click="handleDelete">
          <ion-icon slot="start" :icon="trashOutline"></ion-icon>
          Eliminar
        </ion-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonButton, IonIcon } from '@ionic/vue';
import {
  closeOutline,
  calendarOutline,
  timeOutline,
  flagOutline,
  createOutline,
  trashOutline,
  chevronDownOutline
} from 'ionicons/icons';
import { Activity } from '../../types/activity';

const props = defineProps<{
  isOpen: boolean;
  activity: Activity | null;
}>();

const emit = defineEmits(['close', 'edit', 'delete', 'update-status']);

// Estado del menú de estados
const showStatusMenu = ref(false);
const estadosOptions = ['Pendiente', 'Completado', 'Cancelado', 'Finalizado'];

const toggleStatusMenu = () => {
  showStatusMenu.value = !showStatusMenu.value;
};

const changeStatus = (newStatus: string) => {
  if (props.activity && props.activity.estado !== newStatus) {
    emit('update-status', { activity: props.activity, newStatus });
  }
  showStatusMenu.value = false;
};

const closePanel = () => {
  emit('close');
};

const handleEdit = () => {
  emit('edit', props.activity);
};

const handleDelete = () => {
  emit('delete', props.activity?.id);
};

const getTipoClass = (tipo: string) => {
  const t = tipo?.toLowerCase();
  if (t === 'personal') return 'tipo-personal';
  if (t === 'reuniones') return 'tipo-reuniones';
  if (t === 'misiones') return 'tipo-misiones';
  if (t === 'misionero') return 'tipo-misionero';
  if (t === 'devocionales') return 'tipo-devocionales';
  if (t === 'cima') return 'tipo-cima';
  if (t === 'voluntariado') return 'tipo-voluntariado';
  return 'tipo-otro';
};

const getStatusClass = (estado: string) => {
  const e = estado?.toLowerCase();
  if (e === 'pendiente') return 'estado-pendiente';
  if (e === 'completado') return 'estado-completado';
  if (e === 'cancelado') return 'estado-cancelado';
  return 'estado-otro';
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-GT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

const formatTime = (timeStr: string) => {
  if (!timeStr) return '-';
  if (timeStr.includes(':')) {
    const [hours, minutes] = timeStr.split(':');
    return `${hours}:${minutes}`;
  }
  return timeStr;
};
</script>

<style scoped>
.detail-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  pointer-events: none;
  visibility: hidden;
}

.detail-panel.is-open {
  pointer-events: auto;
  visibility: visible;
}

.panel-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.detail-panel.is-open .panel-backdrop {
  opacity: 1;
}

.panel-content {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 450px;
  height: 100%;
  background: #ffffff;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
}

.detail-panel.is-open .panel-content {
  transform: translateX(0);
}

.panel-header {
  padding: 20px 20px 16px;
  border-bottom: 1px solid #f3f4f6;
  position: relative;
}

.header-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
}

.type-badge-large {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.tipo-personal {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.tipo-reuniones {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.tipo-misiones {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.tipo-misionero {
  background: rgba(99, 102, 241, 0.1);
  color: #4f46e5;
}

.tipo-devocionales {
  background: rgba(249, 115, 22, 0.1);
  color: #ea580c;
}

.tipo-cima {
  background: rgba(139, 92, 246, 0.1);
  color: #7c3aed;
}

.tipo-voluntariado {
  background: rgba(244, 63, 94, 0.1);
  color: #e11d48;
}

.tipo-otro {
  background: rgba(107, 114, 128, 0.1);
  color: #4b5563;
}

.panel-title {
  margin: 0 0 4px 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #111827;
}

.panel-subtitle {
  margin: 0;
  font-size: 0.85rem;
  color: #9ca3af;
  font-family: monospace;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.status-section {
  margin-bottom: 20px;
  position: relative;
}

.status-selector {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px;
  border-radius: 24px;
  transition: background-color 0.2s ease;
}

.status-selector:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.status-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-chevron {
  font-size: 16px;
  color: #6b7280;
}

/* Menú de estados */
.status-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 8px;
  min-width: 180px;
  z-index: 100;
}

.status-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.status-option:hover {
  background-color: #f3f4f6;
}

.status-option.active {
  background-color: #f3f4f6;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.status-dot.estado-pendiente {
  background-color: #f59e0b;
}

.status-dot.estado-completado {
  background-color: #10b981;
}

.status-dot.estado-cancelado {
  background-color: #ef4444;
}

.status-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
}

.estado-pendiente {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.estado-completado {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.estado-cancelado {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.estado-otro {
  background: rgba(107, 114, 128, 0.1);
  color: #4b5563;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.description-text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #374151;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
}

.info-icon {
  font-size: 20px;
  color: #e8913a;
  margin-top: 2px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.info-label {
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.info-value {
  font-size: 0.9rem;
  font-weight: 500;
  color: #111827;
}

.panel-footer {
  padding: 16px 20px 20px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Scrollbar personalizado */
.panel-body::-webkit-scrollbar {
  width: 6px;
}

.panel-body::-webkit-scrollbar-track {
  background: transparent;
}

.panel-body::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.panel-body::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>