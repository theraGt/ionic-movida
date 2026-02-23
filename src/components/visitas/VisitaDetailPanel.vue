<template>
  <div class="detail-panel" :class="{ 'is-open': isOpen }">
    <div class="panel-backdrop" @click="closePanel"></div>

    <div class="panel-content">
      <!-- Header Sticky -->
      <div class="panel-header" :class="{ 'is-scrolled': isScrolled }">
        <div class="header-actions">
          <ion-button fill="clear" size="small" @click="closePanel">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </div>
        <div class="header-content">
          <div class="type-badge-large" :class="getTipoClass(visita?.tipo)">
            {{ visita?.tipo }}
          </div>
          <h2 class="panel-title">Detalle de Visita</h2>
          <p class="panel-subtitle">ID: {{ visita?.id }}</p>
        </div>
      </div>

      <!-- Image Section -->
      <div class="image-section" :class="{ 'is-hidden': isScrolled }" v-if="visita?.foto">
        <img :src="visita.foto" alt="Foto de visita" class="detail-image" />
      </div>
      <div class="image-section placeholder" :class="{ 'is-hidden': isScrolled }" v-else>
        <ion-icon :icon="imageOutline" class="placeholder-icon-large"></ion-icon>
        <span>Sin foto</span>
      </div>

      <!-- Content -->
      <div class="panel-body" ref="panelBodyRef" @scroll="handleScroll">
        <!-- Descripción -->
        <div class="section">
          <h4 class="section-title">Descripción</h4>
          <p class="description-text">{{ visita?.descripcion || 'Sin descripción' }}</p>
        </div>

        <!-- Información Principal -->
        <div class="section">
          <h4 class="section-title">Información</h4>
          <div class="info-grid">
            <div class="info-item">
              <ion-icon :icon="idCardOutline" class="info-icon"></ion-icon>
              <div class="info-content">
                <span class="info-label">ID Actividad</span>
                <span class="info-value">{{ visita?.idActividad }}</span>
              </div>
            </div>
            <div class="info-item">
              <ion-icon :icon="personOutline" class="info-icon"></ion-icon>
              <div class="info-content">
                <span class="info-label">Encargado</span>
                <span class="info-value">{{ visita?.encargado }}</span>
              </div>
            </div>
            <div class="info-item">
              <ion-icon :icon="callOutline" class="info-icon"></ion-icon>
              <div class="info-content">
                <span class="info-label">Contacto</span>
                <span class="info-value">{{ visita?.contacto }}</span>
              </div>
            </div>
            <div class="info-item">
              <ion-icon :icon="calendarOutline" class="info-icon"></ion-icon>
              <div class="info-content">
                <span class="info-label">Fecha Inicio</span>
                <span class="info-value">{{ formatDateTime(visita?.inicio) }}</span>
              </div>
            </div>
            <div class="info-item">
              <ion-icon :icon="flagOutline" class="info-icon"></ion-icon>
              <div class="info-content">
                <span class="info-label">País</span>
                <span class="info-value">{{ visita?.pais }}</span>
              </div>
            </div>
            <div class="info-item">
              <ion-icon :icon="locationOutline" class="info-icon"></ion-icon>
              <div class="info-content">
                <span class="info-label">Coordenadas</span>
                <span class="info-value coord">{{ visita?.coordenada }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Métricas -->
        <div class="section">
          <h4 class="section-title">Métricas</h4>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-icon people">
                <ion-icon :icon="peopleOutline"></ion-icon>
              </div>
              <div class="metric-info">
                <span class="metric-value">{{ visita?.personasAlcanzadas }}</span>
                <span class="metric-label">Personas Alcanzadas</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon contacts">
                <ion-icon :icon="personAddOutline"></ion-icon>
              </div>
              <div class="metric-info">
                <span class="metric-value">{{ visita?.contactosNuevos }}</span>
                <span class="metric-label">Contactos Nuevos</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon distance">
                <ion-icon :icon="speedometerOutline"></ion-icon>
              </div>
              <div class="metric-info">
                <span class="metric-value">{{ visita?.kmRecorridos }} km</span>
                <span class="metric-label">Recorridos</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon time">
                <ion-icon :icon="timeOutline"></ion-icon>
              </div>
              <div class="metric-info">
                <span class="metric-value">{{ visita?.tiempoInvertido }}h</span>
                <span class="metric-label">Tiempo Invertido</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Gastos -->
        <div class="section">
          <h4 class="section-title">Desglose de Gastos</h4>
          <div class="expense-list">
            <div class="expense-item">
              <div class="expense-label">
                <ion-icon :icon="carOutline" class="expense-icon"></ion-icon>
                <span>Gasolina</span>
              </div>
              <span class="expense-value">Q{{ visita?.gasolina }}</span>
            </div>
            <div class="expense-item">
              <div class="expense-label">
                <ion-icon :icon="restaurantOutline" class="expense-icon"></ion-icon>
                <span>Comida</span>
              </div>
              <span class="expense-value">Q{{ visita?.comida }}</span>
            </div>
            <div class="expense-item">
              <div class="expense-label">
                <ion-icon :icon="cashOutline" class="expense-icon"></ion-icon>
                <span>Otros Gastos</span>
              </div>
              <span class="expense-value">Q{{ visita?.otrosGastos }}</span>
            </div>
            <div class="expense-divider"></div>
            <div class="expense-item total">
              <div class="expense-label">
                <ion-icon :icon="walletOutline" class="expense-icon"></ion-icon>
                <span>Total Inversión</span>
              </div>
              <span class="expense-value total">Q{{ visita?.totalInversion }}</span>
            </div>
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
import { IonButton, IonIcon } from '@ionic/vue';
import {
  closeOutline,
  imageOutline,
  personOutline,
  calendarOutline,
  locationOutline,
  callOutline,
  idCardOutline,
  flagOutline,
  peopleOutline,
  personAddOutline,
  speedometerOutline,
  timeOutline,
  carOutline,
  restaurantOutline,
  cashOutline,
  walletOutline,
  createOutline,
  trashOutline,
} from 'ionicons/icons';
import { Visita } from '../../types/visita';
import { ref, watch } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  visita: Visita | null;
}>();

const emit = defineEmits(['close', 'edit', 'delete']);

const panelBodyRef = ref<HTMLDivElement | null>(null);
const isScrolled = ref(false);

const handleScroll = () => {
  if (panelBodyRef.value) {
    isScrolled.value = panelBodyRef.value.scrollTop > 50;
  }
};

// Reset scroll state when panel opens/closes
watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    isScrolled.value = false;
  }
});

const closePanel = () => {
  emit('close');
};

const handleEdit = () => {
  emit('edit', props.visita);
};

const handleDelete = () => {
  emit('delete', props.visita?.id);
};

const getTipoClass = (tipo: string | undefined) => {
  const t = tipo?.toLowerCase();
  if (t === 'prisma') return 'tipo-prisma';
  if (t === 'visita') return 'tipo-visita';
  if (t === 'seguimiento') return 'tipo-seguimiento';
  return 'tipo-otro';
};

const formatDateTime = (dateStr: string | undefined) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString('es-GT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
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
  position: sticky;
  top: 0;
  background: #ffffff;
  z-index: 100;
  transition: all 0.3s ease;
}

.panel-header.is-scrolled {
  padding: 12px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.panel-header.is-scrolled .header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-header.is-scrolled .type-badge-large {
  margin-bottom: 0;
  font-size: 0.7rem;
  padding: 4px 10px;
}

.panel-header.is-scrolled .panel-title {
  font-size: 1rem;
  margin: 0;
}

.panel-header.is-scrolled .panel-subtitle {
  display: none;
}

.header-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 101;
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
  transition: all 0.3s ease;
}

.tipo-prisma {
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
}

.tipo-visita {
  background: rgba(29, 78, 216, 0.1);
  color: #1d4ed8;
}

.tipo-seguimiento {
  background: rgba(21, 128, 61, 0.1);
  color: #15803d;
}

.tipo-otro {
  background: rgba(180, 83, 9, 0.1);
  color: #b45309;
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

.image-section {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #9ca3af;
  transition: all 0.3s ease;
  opacity: 1;
  transform: translateY(0);
}

.image-section.is-hidden {
  height: 0;
  opacity: 0;
  transform: translateY(-20px);
  margin: 0;
  padding: 0;
}

.image-section.placeholder {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
}

.image-section.placeholder.is-hidden {
  height: 0;
  opacity: 0;
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-icon-large {
  font-size: 64px;
  margin-bottom: 8px;
  color: #d1d5db;
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

.info-value.coord {
  font-family: monospace;
  font-size: 0.8rem;
  color: #6b7280;
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
}

.metric-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.metric-icon.people {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.metric-icon.contacts {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.metric-icon.distance {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.metric-icon.time {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.metric-info {
  display: flex;
  flex-direction: column;
}

.metric-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
}

.metric-label {
  font-size: 0.7rem;
  color: #9ca3af;
}

.expense-list {
  background: #f9fafb;
  border-radius: 12px;
  padding: 8px;
}

.expense-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
}

.expense-item.total {
  background: rgba(232, 145, 58, 0.1);
  border-radius: 8px;
  margin-top: 4px;
}

.expense-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #374151;
}

.expense-icon {
  font-size: 18px;
  color: #e8913a;
}

.expense-value {
  font-weight: 600;
  color: #111827;
}

.expense-value.total {
  color: #e8913a;
  font-size: 1.1rem;
}

.expense-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 4px 12px;
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
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.4);
}

.dark .panel-header {
  background: #1f2937;
  border-bottom-color: #374151;
}

.dark .panel-title {
  color: #f3f4f6;
}

.dark .image-section {
  background: #111827;
}

.dark .image-section.placeholder {
  background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
}

.dark .description-text {
  color: #d1d5db;
}

.dark .info-item {
  background: #374151;
}

.dark .info-value {
  color: #f3f4f6;
}

.dark .info-value.coord {
  color: #9ca3af;
}

.dark .metric-card {
  background: #374151;
}

.dark .metric-value {
  color: #f3f4f6;
}

.dark .expense-list {
  background: #374151;
}

.dark .expense-label {
  color: #d1d5db;
}

.dark .expense-value {
  color: #f3f4f6;
}

.dark .expense-divider {
  background: #4b5563;
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