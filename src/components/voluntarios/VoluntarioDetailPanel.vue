<template>
  <div class="detail-panel" :class="{ 'is-open': isOpen }">
    <div class="panel-backdrop" @click="closePanel"></div>
    
    <div class="panel-content">
      <!-- Header -->
      <div class="panel-header">
        <div class="header-actions">
          <ion-button fill="clear" size="small" color="medium" @click="handleDelete">
            <ion-icon :icon="trashOutline"></ion-icon>
          </ion-button>
          <ion-button fill="clear" size="small" color="medium" @click="handleExport">
            <ion-icon :icon="downloadOutline"></ion-icon>
          </ion-button>
          <ion-button fill="clear" size="small" color="medium" @click="handlePrint">
            <ion-icon :icon="printOutline"></ion-icon>
          </ion-button>
          <ion-button fill="solid" size="small" class="edit-btn" @click="handleEdit">
            <ion-icon slot="start" :icon="createOutline"></ion-icon>
            Edit
          </ion-button>
          <ion-button fill="clear" size="small" @click="closePanel">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </div>
        <h2 class="panel-title">{{ voluntario?.id || 'Selecciona un voluntario' }}</h2>
      </div>

      <div v-if="voluntario" class="panel-body">
        <!-- Foto y nombre -->
        <div class="profile-section">
          <div class="profile-image-container">
            <img
              v-if="voluntario.foto"
              :src="voluntario.foto"
              :alt="voluntario.nombreCompleto"
              class="profile-image"
            />
            <div v-else class="profile-image-placeholder">
              <ion-icon :icon="personOutline" class="profile-placeholder-icon"></ion-icon>
            </div>
          </div>
          
          <div class="profile-info">
            <h3 class="profile-name">{{ voluntario.nombreCompleto }}</h3>
            <p class="profile-iglesia">{{ voluntario.iglesia }}</p>
            <p class="profile-area">{{ voluntario.areasServicio }}</p>
          </div>
        </div>

        <!-- Documentos -->
        <div class="documents-section">
          <div class="document-item" v-if="voluntario.cartaPastoral">
            <div class="document-icon carta">
              <ion-icon :icon="documentTextOutline"></ion-icon>
            </div>
            <div class="document-info">
              <span class="document-label">CARTA PASTORAL</span>
              <span class="document-year">2025</span>
            </div>
          </div>
          <div class="document-item" v-if="voluntario.testimonio">
            <div class="document-icon testimonio">
              <ion-icon :icon="chatbubbleOutline"></ion-icon>
            </div>
            <div class="document-info">
              <span class="document-label">TESTIMONIO</span>
              <span class="document-year">2025</span>
            </div>
          </div>
        </div>

        <!-- Datos Personales -->
        <div class="section">
          <h4 class="section-title">Datos Personales</h4>
          <div class="data-grid">
            <div class="data-row">
              <span class="data-label">ID VOLUNTARIO</span>
              <span class="data-value">{{ voluntario.id }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">FECHA INSCRIPCION</span>
              <span class="data-value">{{ voluntario.fechaInscripcion }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">HORA INSCRIPCION</span>
              <span class="data-value">{{ voluntario.horaInscripcion }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">NOMBRE COMPLETO</span>
              <span class="data-value">{{ voluntario.nombreCompleto }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">PAIS DE RESIDENCIA</span>
              <span class="data-value">{{ voluntario.pais }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">DOCUMENTO DE IDENTIFICACION</span>
              <span class="data-value">{{ voluntario.documentoIdentificacion }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">FECHA DE NACIMIENTO</span>
              <span class="data-value">{{ voluntario.fechaNacimiento }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">EDAD</span>
              <span class="data-value">{{ voluntario.edad }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">GENERO</span>
              <span class="data-value">{{ voluntario.genero }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">PROFESION U OFICIO</span>
              <span class="data-value">{{ voluntario.profesionOficio }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">OCUPACION</span>
              <span class="data-value">{{ voluntario.ocupacion }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">TELEFONO</span>
              <span class="data-value">{{ voluntario.telefono }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">ESTADO CIVIL</span>
              <span class="data-value">{{ voluntario.estadoCivil }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">DEPARTAMENTO O REGION</span>
              <span class="data-value">{{ voluntario.departamentoRegion }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">MUNICIPIO O PROVINCIA</span>
              <span class="data-value">{{ voluntario.municipioProvincia }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">CIUDAD</span>
              <span class="data-value">{{ voluntario.ciudad }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">GRADO ACADEMICO</span>
              <span class="data-value">{{ voluntario.gradoAcademico }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">ESTUDIOS ADICIONALES</span>
              <span class="data-value">{{ voluntario.estudiosAdicionales || '-' }}</span>
            </div>
          </div>
        </div>

        <!-- Contacto -->
        <div class="section">
          <h4 class="section-title">Contacto</h4>
          <div class="data-grid">
            <div class="data-row">
              <span class="data-label">CORREO</span>
              <span class="data-value">{{ voluntario.correo }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">FACEBOOK</span>
              <a v-if="voluntario.facebook" :href="voluntario.facebook" target="_blank" class="data-value link">{{ truncateUrl(voluntario.facebook) }}</a>
              <span v-else class="data-value">-</span>
            </div>
            <div class="data-row">
              <span class="data-label">INSTAGRAM</span>
              <a v-if="voluntario.instagram" :href="voluntario.instagram" target="_blank" class="data-value link">{{ truncateUrl(voluntario.instagram) }}</a>
              <span v-else class="data-value">-</span>
            </div>
            <div class="data-row">
              <span class="data-label">TIKTOK</span>
              <a v-if="voluntario.tiktok" :href="voluntario.tiktok" target="_blank" class="data-value link">{{ truncateUrl(voluntario.tiktok) }}</a>
              <span v-else class="data-value">-</span>
            </div>
          </div>
        </div>

        <!-- Informacion de Iglesia -->
        <div class="section">
          <h4 class="section-title">Informacion de Iglesia</h4>
          <div class="data-grid">
            <div class="data-row">
              <span class="data-label">IGLESIA</span>
              <span class="data-value">{{ voluntario.iglesia }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">PASTOR</span>
              <span class="data-value">{{ voluntario.pastor }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">CONTACTO PASTOR</span>
              <span class="data-value">{{ voluntario.contactoPastor }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">DENOMINACION</span>
              <span class="data-value">{{ voluntario.denominacion }}</span>
            </div>
          </div>
        </div>

        <!-- Capacitacion -->
        <div class="section">
          <h4 class="section-title">Capacitacion</h4>
          <div class="data-grid">
            <div class="data-row">
              <span class="data-label">CURSO STORYLINE</span>
              <span class="data-value">{{ voluntario.cursoStoryline }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">DIPLOMA STORYLINE</span>
              <span class="data-value">{{ voluntario.diplomaStoryline || '-' }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">CURSO VAYA A MOVILIZAR</span>
              <span class="data-value">{{ voluntario.cursoVayaMovilizar }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">DIPLOMA VAYA MOVILIZAR</span>
              <span class="data-value">{{ voluntario.diplomaVayaMovilizar || '-' }}</span>
            </div>
          </div>
        </div>

        <!-- Experiencia -->
        <div class="section">
          <h4 class="section-title">Experiencia</h4>
          <div class="data-grid">
            <div class="data-row">
              <span class="data-label">AREAS DE SERVICIO</span>
              <span class="data-value">{{ voluntario.areasServicio }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">DONES Y TALENTOS</span>
              <span class="data-value">{{ voluntario.donesTalentos }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">CIMAS ASISTIDOS</span>
              <span class="data-value">{{ voluntario.cimasAsistidos || '-' }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">AREAS DE SERVICIO EN CIMA</span>
              <span class="data-value">{{ voluntario.areasServicioCima || '-' }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">PROGRAMAS PARTICIPADOS</span>
              <span class="data-value">{{ voluntario.programasParticipados || '-' }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">TIPO DE VOLUNTARIADO</span>
              <span class="data-value">{{ voluntario.tipoVoluntariado }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="panel-body empty">
        <div class="empty-state-large">
          <ion-icon :icon="peopleOutline" class="empty-icon-large"></ion-icon>
          <h3>Selecciona un voluntario</h3>
          <p>Elige un voluntario de la lista para ver sus detalles</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonButton, IonIcon } from '@ionic/vue';
import {
  closeOutline,
  personOutline,
  peopleOutline,
  createOutline,
  trashOutline,
  downloadOutline,
  printOutline,
  documentTextOutline,
  chatbubbleOutline,
} from 'ionicons/icons';
import { Voluntario } from '../../types/voluntario';

const props = defineProps<{
  isOpen: boolean;
  voluntario: Voluntario | null;
}>();

const emit = defineEmits(['close', 'edit', 'delete', 'export', 'print']);

const closePanel = () => {
  emit('close');
};

const handleEdit = () => {
  emit('edit', props.voluntario);
};

const handleDelete = () => {
  emit('delete', props.voluntario?.id);
};

const handleExport = () => {
  emit('export', props.voluntario);
};

const handlePrint = () => {
  emit('print', props.voluntario);
};

const truncateUrl = (url: string) => {
  if (!url) return '-';
  if (url.length <= 30) return url;
  return url.substring(0, 27) + '...';
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
  max-width: 480px;
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
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  background: #ffffff;
}

.header-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
}

.edit-btn {
  --background: #e8913a;
  --color: white;
  --border-radius: 6px;
  font-weight: 500;
  text-transform: none;
}

.panel-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.panel-body.empty {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Profile Section */
.profile-section {
  text-align: center;
  margin-bottom: 24px;
}

.profile-image-container {
  margin-bottom: 16px;
}

.profile-image {
  width: 180px;
  height: 180px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-image-placeholder {
  width: 180px;
  height: 180px;
  border-radius: 12px;
  background: linear-gradient(135deg, #e8913a 0%, #d97706 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.profile-placeholder-icon {
  font-size: 80px;
  color: white;
}

.profile-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.profile-iglesia {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.profile-area {
  font-size: 0.85rem;
  color: #e8913a;
  font-weight: 500;
  margin: 0;
}

/* Documents Section */
.documents-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding: 0 20px;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  padding: 12px;
  background: #fef3c7;
  border-radius: 8px;
}

.document-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.document-icon.carta {
  background: rgba(232, 145, 58, 0.2);
  color: #e8913a;
}

.document-icon.testimonio {
  background: rgba(232, 145, 58, 0.2);
  color: #e8913a;
}

.document-info {
  display: flex;
  flex-direction: column;
}

.document-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #92400e;
  letter-spacing: 0.05em;
}

.document-year {
  font-size: 0.8rem;
  color: #d97706;
}

/* Section */
.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

/* Data Grid */
.data-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.data-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.data-label {
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  flex-shrink: 0;
  max-width: 50%;
}

.data-value {
  font-size: 0.9rem;
  font-weight: 500;
  color: #111827;
  text-align: right;
  word-break: break-word;
}

.data-value.link {
  color: #e8913a;
  text-decoration: none;
}

.data-value.link:hover {
  text-decoration: underline;
}

/* Empty State */
.empty-state-large {
  text-align: center;
  color: #9ca3af;
  padding: 40px;
}

.empty-icon-large {
  font-size: 80px;
  color: #d1d5db;
  margin-bottom: 20px;
}

.empty-state-large h3 {
  margin: 0 0 8px 0;
  color: #6b7280;
  font-weight: 600;
}

.empty-state-large p {
  margin: 0;
  font-size: 0.9rem;
}

/* Scrollbar */
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
