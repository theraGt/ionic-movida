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
        <div class="type-badge-large" :class="getTipoClass(location?.tipo)">
          {{ getTipoLabel(location?.tipo) }}
        </div>
        <h2 class="panel-title">{{ location?.nombre }}</h2>
        <p class="panel-subtitle">ID: {{ location?.id }}</p>
      </div>

      <!-- Content -->
      <div class="panel-body">
        <!-- Coordenadas -->
        <div class="section">
          <h4 class="section-title">Ubicación</h4>
          <div class="info-grid">
            <div class="info-item">
              <ion-icon :icon="locationOutline" class="info-icon"></ion-icon>
              <div class="info-content">
                <span class="info-label">Latitud</span>
                <span class="info-value coord">{{ location?.latitud }}</span>
              </div>
            </div>
            <div class="info-item">
              <ion-icon :icon="locationOutline" class="info-icon"></ion-icon>
              <div class="info-content">
                <span class="info-label">Longitud</span>
                <span class="info-value coord">{{ location?.longitud }}</span>
              </div>
            </div>
            <div class="info-item" v-if="location?.direccion">
              <ion-icon :icon="mapOutline" class="info-icon"></ion-icon>
              <div class="info-content">
                <span class="info-label">Dirección</span>
                <span class="info-value">{{ location?.direccion }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Información Principal -->
        <div class="section" v-if="location?.descripcion || location?.pais">
          <h4 class="section-title">Información</h4>
          <div class="info-grid">
            <div class="info-item" v-if="location?.descripcion">
              <ion-icon :icon="documentTextOutline" class="info-icon"></ion-icon>
              <div class="info-content">
                <span class="info-label">Descripción</span>
                <span class="info-value">{{ location?.descripcion }}</span>
              </div>
            </div>
            <div class="info-item" v-if="location?.pais">
              <ion-icon :icon="flagOutline" class="info-icon"></ion-icon>
              <div class="info-content">
                <span class="info-label">País</span>
                <span class="info-value">{{ location?.pais }}</span>
              </div>
            </div>
            <div class="info-item" v-if="location?.encargado">
              <ion-icon :icon="personOutline" class="info-icon"></ion-icon>
              <div class="info-content">
                <span class="info-label">Encargado</span>
                <span class="info-value">{{ location?.encargado }}</span>
              </div>
            </div>
            <div class="info-item" v-if="location?.fecha">
              <ion-icon :icon="calendarOutline" class="info-icon"></ion-icon>
              <div class="info-content">
                <span class="info-label">Fecha</span>
                <span class="info-value">{{ formatDate(location?.fecha) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado -->
        <div class="section" v-if="location?.estado">
          <h4 class="section-title">Estado</h4>
          <span class="status-badge" :class="getStatusClass(location?.estado)">
            {{ location?.estado }}
          </span>
        </div>

        <!-- Acciones rápidas -->
        <div class="section">
          <h4 class="section-title">Acciones</h4>
          <div class="actions-grid">
            <ion-button expand="block" fill="outline" class="action-btn" @click="copyCoordinates">
              <ion-icon slot="start" :icon="copyOutline"></ion-icon>
              Copiar Coordenadas
            </ion-button>
            <ion-button expand="block" fill="outline" class="action-btn" @click="openInMaps">
              <ion-icon slot="start" :icon="navigateOutline"></ion-icon>
              Abrir en Maps
            </ion-button>
          </div>
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
import { IonButton, IonIcon, toastController } from '@ionic/vue';
import {
  closeOutline,
  locationOutline,
  mapOutline,
  documentTextOutline,
  flagOutline,
  personOutline,
  calendarOutline,
  createOutline,
  trashOutline,
  copyOutline,
  navigateOutline
} from 'ionicons/icons';
import { MapLocation } from '../../types/map';

const props = defineProps<{
  isOpen: boolean;
  location: MapLocation | null;
}>();

const emit = defineEmits(['close', 'edit', 'delete']);

const closePanel = () => {
  emit('close');
};

const handleEdit = () => {
  emit('edit', props.location);
};

const handleDelete = () => {
  emit('delete', props.location?.id);
};

const copyCoordinates = async () => {
  if (props.location) {
    const coords = `${props.location.latitud}, ${props.location.longitud}`;
    try {
      await navigator.clipboard.writeText(coords);
      const toast = await toastController.create({
        message: 'Coordenadas copiadas al portapapeles',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  }
};

const openInMaps = () => {
  if (props.location) {
    const url = `https://www.google.com/maps?q=${props.location.latitud},${props.location.longitud}`;
    window.open(url, '_blank');
  }
};

const getTipoLabel = (tipo: string | undefined) => {
  const labels: Record<string, string> = {
    'actividad': 'Actividad',
    'visita': 'Visita',
    'voluntario': 'Voluntario',
    'mision': 'Misión'
  };
  return labels[tipo || ''] || tipo;
};

const getTipoClass = (tipo: string | undefined) => {
  const t = tipo?.toLowerCase();
  if (t === 'actividad') return 'tipo-actividad';
  if (t === 'visita') return 'tipo-visita';
  if (t === 'voluntario') return 'tipo-voluntario';
  if (t === 'mision') return 'tipo-mision';
  return 'tipo-otro';
};

const getStatusClass = (estado: string | undefined) => {
  const e = estado?.toLowerCase();
  if (e === 'pendiente') return 'estado-pendiente';
  if (e === 'completado' || e === 'completada') return 'estado-completado';
  if (e === 'cancelado' || e === 'cancelada') return 'estado-cancelado';
  return 'estado-otro';
};

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-GT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
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

.tipo-actividad {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.tipo-visita {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.tipo-voluntario {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.tipo-mision {
  background: rgba(139, 92, 246, 0.1);
  color: #7c3aed;
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

.status-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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

.info-value.coord {
  font-family: monospace;
  font-size: 0.85rem;
  color: #6b7280;
}

.actions-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-btn {
  --border-color: #e5e7eb;
  --color: #374151;
  font-weight: 500;
}

.action-btn:hover {
  --background: #f9fafb;
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

/* Dark Mode */
.dark .panel-content {
  background: #1f2937;
}

.dark .panel-header {
  border-bottom-color: #374151;
}

.dark .panel-title {
  color: #f3f4f6;
}

.dark .panel-subtitle {
  color: #6b7280;
}

.dark .section-title {
  color: #9ca3af;
}

.dark .info-item {
  background: #374151;
}

.dark .info-icon {
  color: #f0a85a;
}

.dark .info-label {
  color: #6b7280;
}

.dark .info-value {
  color: #f3f4f6;
}

.dark .info-value.coord {
  color: #9ca3af;
}

.dark .action-btn {
  --border-color: #374151;
  --color: #d1d5db;
}

.dark .action-btn:hover {
  --background: #374151;
}

.dark .panel-footer {
  border-top-color: #374151;
}

.dark .panel-body::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark .panel-body::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
