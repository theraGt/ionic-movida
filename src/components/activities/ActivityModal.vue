<template>
  <ion-modal :is-open="isOpen" @didDismiss="handleClose" class="activity-modal" :backdrop-dismiss="false">
    <ion-header class="modal-header">
      <ion-toolbar>
        <ion-title>
          <div class="title-wrapper">
            <ion-icon :icon="activity ? createOutline : addCircleOutline" class="title-icon"></ion-icon>
            <span>{{ activity ? 'Editar Actividad' : 'Nueva Actividad' }}</span>
          </div>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="handleClose" class="close-button">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="modal-content">
      <form @submit.prevent="handleSubmit" class="form-container">
        <!-- Sección: Fecha y Horario -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon-wrapper green">
              <ion-icon :icon="calendarOutline"></ion-icon>
            </div>
            <h3 class="section-title">Fecha y Horario</h3>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Fecha <span class="required">*</span></label>
              <div class="input-wrapper">
                <ion-icon :icon="calendarClearOutline" class="input-icon"></ion-icon>
                <ion-input v-model="form.fecha" type="date" class="custom-input" required></ion-input>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Hora <span class="required">*</span></label>
              <div class="input-wrapper">
                <ion-icon :icon="timeOutline" class="input-icon"></ion-icon>
                <ion-input v-model="form.hora" type="time" class="custom-input" required></ion-input>
              </div>
            </div>

          </div>
        </div>

        <!-- Sección: Información Básica -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon-wrapper blue">
              <ion-icon :icon="informationCircleOutline"></ion-icon>
            </div>
            <h3 class="section-title">Información Básica</h3>
          </div>

          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label">Nombre de la Actividad <span class="required">*</span></label>
              <div class="input-wrapper">
                <ion-icon :icon="clipboardOutline" class="input-icon"></ion-icon>
                <ion-input v-model="form.actividad" placeholder="Ej: Reunión de planificación" class="custom-input"
                  required></ion-input>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Tipo <span class="required">*</span></label>
              <div class="select-wrapper">
                <ion-icon :icon="bookmarkOutline" class="input-icon"></ion-icon>
                <ion-select v-model="form.tipo" placeholder="Seleccionar tipo" interface="popover" class="custom-select"
                  required>
                  <ion-select-option value="Personal">Personal</ion-select-option>
                  <ion-select-option value="Reuniones">Reuniones</ion-select-option>
                  <ion-select-option value="Misiones">Misiones</ion-select-option>
                  <ion-select-option value="Misionero">Misionero</ion-select-option>
                  <ion-select-option value="Devocionales">Devocionales</ion-select-option>
                  <ion-select-option value="Cima">Cima</ion-select-option>
                  <ion-select-option value="Voluntariado">Voluntariado</ion-select-option>
                </ion-select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Estado <span class="required">*</span></label>
              <div class="select-wrapper">
                <ion-icon :icon="checkmarkCircleOutline" class="input-icon"></ion-icon>
                <ion-select v-model="form.estado" placeholder="Seleccionar estado" interface="popover"
                  class="custom-select" required>
                  <ion-select-option value="Pendiente">Pendiente</ion-select-option>
                  <ion-select-option value="Completado">Completado</ion-select-option>
                  <ion-select-option value="Cancelado">Cancelado</ion-select-option>
                  <ion-select-option value="Finalizado">Finalizado</ion-select-option>
                </ion-select>
              </div>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Comentario</label>
              <ion-textarea v-model="form.comentario" rows="3"
                placeholder="Agregar detalles adicionales sobre la actividad..." class="custom-textarea"></ion-textarea>
            </div>
          </div>
        </div>

        <!-- Sección: Ubicación -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon-wrapper purple">
              <ion-icon :icon="locationOutline"></ion-icon>
            </div>
            <h3 class="section-title">Ubicación</h3>
          </div>

          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label">País <span class="required">*</span></label>
              <div class="select-wrapper">
                <ion-icon :icon="flagOutline" class="input-icon"></ion-icon>
                <ion-select v-model="form.pais" placeholder="Seleccionar país" interface="popover" class="custom-select"
                  required>
                  <ion-select-option value="Guatemala">Guatemala</ion-select-option>
                  <ion-select-option value="El Salvador">El Salvador</ion-select-option>
                  <ion-select-option value="Honduras">Honduras</ion-select-option>
                  <ion-select-option value="Nicaragua">Nicaragua</ion-select-option>
                  <ion-select-option value="Costa Rica">Costa Rica</ion-select-option>
                  <ion-select-option value="Panamá">Panamá</ion-select-option>
                </ion-select>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="form-actions">
          <ion-button type="button" fill="outline" color="medium" @click="handleClose" class="cancel-button">
            <ion-icon slot="start" :icon="closeOutline"></ion-icon>
            Cancelar
          </ion-button>
          <ion-button type="submit" class="save-button">
            <ion-icon slot="start" :icon="checkmarkOutline"></ion-icon>
            {{ activity ? 'Guardar Cambios' : 'Crear Actividad' }}
          </ion-button>
        </div>
      </form>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonIcon,
  toastController,
} from '@ionic/vue';
import {
  closeOutline,
  createOutline,
  addCircleOutline,
  informationCircleOutline,
  calendarOutline,
  locationOutline,
  clipboardOutline,
  bookmarkOutline,
  checkmarkCircleOutline,
  calendarClearOutline,
  timeOutline,
  flagOutline,
  checkmarkOutline
} from 'ionicons/icons';
import { Activity } from '@/types/activity';

const API_URL = 'https://thera-ia-api-movida-app.9zx1zd.easypanel.host/';

const props = defineProps<{
  isOpen: boolean;
  activity: Activity | null;
}>();

const emit = defineEmits(['close', 'save']);

const form = ref<Partial<Activity>>({
  actividad: '',
  tipo: 'Personal',
  estado: 'Pendiente',
  fecha: new Date().toISOString().split('T')[0],
  hora: '09:00',
  pais: 'Guatemala',
  comentario: ''
});

const resetForm = () => {
  form.value = {
    actividad: '',
    tipo: 'Personal',
    estado: 'Pendiente',
    fecha: new Date().toISOString().split('T')[0],
    hora: '09:00',
    pais: 'Guatemala',
    comentario: ''
  };
};

watch(
  () => props.activity,
  (newActivity) => {
    if (newActivity) {
      form.value = { ...newActivity };
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const handleClose = () => {
  emit('close');
};

const handleSubmit = async () => {
  try {
    const horaValue = typeof form.value.hora === 'string' && form.value.hora.includes(':') 
      ? form.value.hora 
      : '09:00';

    const formData = {
      ...form.value,
      fecha: new Date(form.value.fecha!).toISOString(),
      hora: horaValue
    };

    if (props.activity) {
      await fetch(`${API_URL}/activities/${props.activity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } else {
      await fetch(`${API_URL}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    }

    const toast = await toastController.create({
      message: props.activity ? 'Actividad actualizada exitosamente' : 'Actividad creada exitosamente',
      duration: 2000,
      color: 'success',
    });
    await toast.present();

    emit('save');
  } catch (error) {
    console.error('Error:', error);
    const toast = await toastController.create({
      message: 'Error al guardar la actividad',
      duration: 2000,
      color: 'danger',
    });
    await toast.present();
  }
};
</script>

<style scoped>
.activity-modal {
  --width: 95%;
  --max-width: 600px;
  --height: 90%;
  --max-height: 800px;
  --border-radius: 20px;
}

.modal-header {
  --background: linear-gradient(135deg, #e8913a 0%, #d67d2a 100%);
}

.modal-header ion-toolbar {
  --background: transparent;
  --color: rgb(0, 0, 0);
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  font-size: 24px;
}

.close-button {
  --color: rgb(0, 0, 0);
}

.modal-content {
  --background: #f8f9fa;
}

.form-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.section-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.section-icon-wrapper.blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.section-icon-wrapper.green {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.section-icon-wrapper.purple {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.section-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #4b5563;
}

.required {
  color: #ef4444;
}

.input-wrapper,
.select-wrapper {
  display: flex;
  align-items: center;
  background: #f3f4f6;
  border-radius: 10px;
  padding: 0 12px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.input-wrapper:focus-within,
.select-wrapper:focus-within {
  border-color: #e8913a;
  background: white;
}

.input-icon {
  font-size: 18px;
  color: #9ca3af;
  margin-right: 10px;
}

.custom-input,
.custom-select,
.custom-textarea {
  --background: transparent;
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 12px;
  --padding-bottom: 12px;
  --placeholder-color: #9ca3af;
  --color: #1f2937;
  flex: 1;
}

.custom-textarea {
  --padding-start: 12px;
  --padding-end: 12px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  background: #f3f4f6;
  border-radius: 10px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.custom-textarea:focus-within {
  border-color: #e8913a;
  background: white;
}

/* Botones */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.cancel-button {
  --border-radius: 10px;
  --padding-start: 20px;
  --padding-end: 20px;
}

.save-button {
  --background: linear-gradient(135deg, #e8913a 0%, #d67d2a 100%);
  --border-radius: 10px;
  --padding-start: 24px;
  --padding-end: 24px;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>