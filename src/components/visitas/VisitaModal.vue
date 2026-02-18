<template>
  <ion-modal :is-open="isOpen" @didDismiss="handleClose" class="visita-modal" :backdrop-dismiss="false">
    <ion-header class="modal-header">
      <ion-toolbar>
        <ion-title>
          <div class="title-wrapper">
            <ion-icon :icon="visita ? createOutline : addCircleOutline" class="title-icon"></ion-icon>
            <span>{{ visita ? 'Editar Visita' : 'Nueva Visita' }}</span>
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
        <!-- Sección: Información Básica -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon-wrapper blue">
              <ion-icon :icon="informationCircleOutline"></ion-icon>
            </div>
            <h3 class="section-title">Información Básica</h3>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">ID Actividad</label>
              <div class="input-wrapper">
                <ion-icon :icon="idCardOutline" class="input-icon"></ion-icon>
                <ion-input v-model="form.idActividad" placeholder="Ej: 0fa9fb23" class="custom-input"
                  required></ion-input>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Tipo de Visita</label>
              <div class="select-wrapper">
                <ion-icon :icon="bookmarkOutline" class="input-icon"></ion-icon>
                <ion-select v-model="form.tipo" placeholder="Seleccionar tipo" interface="popover"
                  class="custom-select">
                  <ion-select-option value="Prisma">Prisma</ion-select-option>
                  <ion-select-option value="Visita">Visita</ion-select-option>
                  <ion-select-option value="Seguimiento">Seguimiento</ion-select-option>
                  <ion-select-option value="Otro">Otro</ion-select-option>
                </ion-select>
              </div>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Descripción</label>
              <ion-textarea v-model="form.descripcion" rows="3" placeholder="Describe el propósito de la visita..."
                class="custom-textarea"></ion-textarea>
            </div>
          </div>
        </div>

        <!-- Sección: Fecha y Ubicación -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon-wrapper green">
              <ion-icon :icon="locationOutline"></ion-icon>
            </div>
            <h3 class="section-title">Fecha y Ubicación</h3>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Fecha y Hora</label>
              <div class="datetime-wrapper">
                <ion-icon :icon="calendarOutline" class="input-icon"></ion-icon>
                <ion-datetime v-model="form.inicio" presentation="date-time" display-format="DD/MM/YYYY HH:mm"
                  class="custom-datetime"></ion-datetime>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">País</label>
              <div class="select-wrapper">
                <ion-icon :icon="flagOutline" class="input-icon"></ion-icon>
                <ion-select v-model="form.pais" placeholder="Seleccionar país" interface="popover"
                  class="custom-select">
                  <ion-select-option value="Guatemala">Guatemala</ion-select-option>
                  <ion-select-option value="El Salvador">El Salvador</ion-select-option>
                  <ion-select-option value="Honduras">Honduras</ion-select-option>
                  <ion-select-option value="Nicaragua">Nicaragua</ion-select-option>
                  <ion-select-option value="Costa Rica">Costa Rica</ion-select-option>
                  <ion-select-option value="Panamá">Panamá</ion-select-option>
                </ion-select>
              </div>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Coordenadas</label>
              <div class="input-wrapper">
                <ion-icon :icon="mapOutline" class="input-icon"></ion-icon>
                <ion-input v-model="form.coordenada" placeholder="Ej: 14.588310, -90.530080"
                  class="custom-input"></ion-input>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección: Contacto -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon-wrapper purple">
              <ion-icon :icon="personOutline"></ion-icon>
            </div>
            <h3 class="section-title">Contacto</h3>
          </div>

          <div class="form-grid two-columns">
            <div class="form-group">
              <label class="form-label">Encargado</label>
              <div class="input-wrapper">
                <ion-icon :icon="personCircleOutline" class="input-icon"></ion-icon>
                <ion-input v-model="form.encargado" placeholder="Nombre completo" class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Teléfono</label>
              <div class="input-wrapper">
                <ion-icon :icon="callOutline" class="input-icon"></ion-icon>
                <ion-input v-model="form.contacto" type="tel" placeholder="Ej: 50249989952"
                  class="custom-input"></ion-input>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección: Foto -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon-wrapper orange">
              <ion-icon :icon="imageOutline"></ion-icon>
            </div>
            <h3 class="section-title">Imagen</h3>
          </div>

          <div class="form-group">
            <label class="form-label">URL de la Foto</label>
            <div class="input-wrapper">
              <ion-icon :icon="linkOutline" class="input-icon"></ion-icon>
              <ion-input v-model="form.foto" placeholder="https://ejemplo.com/imagen.jpg"
                class="custom-input"></ion-input>
            </div>
            <div v-if="form.foto" class="image-preview">
              <img :src="form.foto" alt="Preview" @error="form.foto = ''" />
            </div>
          </div>
        </div>

        <!-- Sección: Métricas -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon-wrapper teal">
              <ion-icon :icon="statsChartOutline"></ion-icon>
            </div>
            <h3 class="section-title">Métricas</h3>
          </div>

          <div class="metrics-form-grid">
            <div class="metric-input-group">
              <label class="metric-label">Personas Alcanzadas</label>
              <div class="metric-input-wrapper">
                <ion-icon :icon="peopleOutline" class="metric-icon"></ion-icon>
                <ion-input v-model.number="form.personasAlcanzadas" type="number" min="0"
                  class="metric-input"></ion-input>
              </div>
            </div>

            <div class="metric-input-group">
              <label class="metric-label">Contactos Nuevos</label>
              <div class="metric-input-wrapper">
                <ion-icon :icon="personAddOutline" class="metric-icon"></ion-icon>
                <ion-input v-model.number="form.contactosNuevos" type="number" min="0" class="metric-input"></ion-input>
              </div>
            </div>

            <div class="metric-input-group">
              <label class="metric-label">KM Recorridos</label>
              <div class="metric-input-wrapper">
                <ion-icon :icon="speedometerOutline" class="metric-icon"></ion-icon>
                <ion-input v-model.number="form.kmRecorridos" type="number" min="0" step="0.1"
                  class="metric-input"></ion-input>
              </div>
            </div>

            <div class="metric-input-group">
              <label class="metric-label">Tiempo (horas)</label>
              <div class="metric-input-wrapper">
                <ion-icon :icon="timeOutline" class="metric-icon"></ion-icon>
                <ion-input v-model.number="form.tiempoInvertido" type="number" min="0" step="0.5"
                  class="metric-input"></ion-input>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección: Gastos -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon-wrapper red">
              <ion-icon :icon="cashOutline"></ion-icon>
            </div>
            <h3 class="section-title">Gastos</h3>
          </div>

          <div class="expenses-grid">
            <div class="expense-input-group">
              <label class="expense-label">
                <ion-icon :icon="carOutline"></ion-icon>
                <span>Gasolina</span>
              </label>
              <div class="expense-input-wrapper">
                <span class="currency">Q</span>
                <ion-input v-model.number="form.gasolina" type="number" min="0" step="0.01" @ionInput="calcularTotal"
                  class="expense-input"></ion-input>
              </div>
            </div>

            <div class="expense-input-group">
              <label class="expense-label">
                <ion-icon :icon="restaurantOutline"></ion-icon>
                <span>Comida</span>
              </label>
              <div class="expense-input-wrapper">
                <span class="currency">Q</span>
                <ion-input v-model.number="form.comida" type="number" min="0" step="0.01" @ionInput="calcularTotal"
                  class="expense-input"></ion-input>
              </div>
            </div>

            <div class="expense-input-group">
              <label class="expense-label">
                <ion-icon :icon="fileTrayFullOutline"></ion-icon>
                <span>Otros</span>
              </label>
              <div class="expense-input-wrapper">
                <span class="currency">Q</span>
                <ion-input v-model.number="form.otrosGastos" type="number" min="0" step="0.01" @ionInput="calcularTotal"
                  class="expense-input"></ion-input>
              </div>
            </div>

            <div class="expense-total-card">
              <div class="total-label">
                <ion-icon :icon="walletOutline"></ion-icon>
                <span>Total Inversión</span>
              </div>
              <div class="total-amount">Q{{ form.totalInversion }}</div>
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
            {{ visita ? 'Guardar Cambios' : 'Crear Visita' }}
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
  IonDatetime,
  IonIcon,
  toastController,
} from '@ionic/vue';
import {
  closeOutline,
  createOutline,
  addCircleOutline,
  informationCircleOutline,
  locationOutline,
  personOutline,
  imageOutline,
  statsChartOutline,
  cashOutline,
  idCardOutline,
  bookmarkOutline,
  flagOutline,
  mapOutline,
  personCircleOutline,
  callOutline,
  linkOutline,
  peopleOutline,
  personAddOutline,
  speedometerOutline,
  timeOutline,
  carOutline,
  restaurantOutline,
  fileTrayFullOutline,
  walletOutline,
  checkmarkOutline,
  calendarOutline,
} from 'ionicons/icons';
import { Visita } from '@/types/visita';

const API_URL = 'https://thera-ia-api-movida-app.9zx1zd.easypanel.host/';

const props = defineProps<{
  isOpen: boolean;
  visita: Visita | null;
}>();

const emit = defineEmits(['close', 'save']);

const form = ref<Partial<Visita>>({
  idActividad: '',
  inicio: new Date().toISOString(),
  coordenada: '',
  descripcion: '',
  contacto: '',
  encargado: '',
  foto: '',
  tipo: '',
  pais: '',
  personasAlcanzadas: 0,
  contactosNuevos: 0,
  kmRecorridos: 0,
  tiempoInvertido: 0,
  gasolina: 0,
  comida: 0,
  otrosGastos: 0,
  totalInversion: 0,
});

const resetForm = () => {
  form.value = {
    idActividad: '',
    inicio: new Date().toISOString(),
    coordenada: '',
    descripcion: '',
    contacto: '',
    encargado: '',
    foto: '',
    tipo: '',
    pais: '',
    personasAlcanzadas: 0,
    contactosNuevos: 0,
    kmRecorridos: 0,
    tiempoInvertido: 0,
    gasolina: 0,
    comida: 0,
    otrosGastos: 0,
    totalInversion: 0,
  };
};

watch(
  () => props.visita,
  (newVisita) => {
    if (newVisita) {
      form.value = { ...newVisita };
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const calcularTotal = () => {
  form.value.totalInversion =
    (form.value.gasolina || 0) +
    (form.value.comida || 0) +
    (form.value.otrosGastos || 0);
};

const handleClose = () => {
  emit('close');
};

const handleSubmit = async () => {
  try {
    calcularTotal();

    if (props.visita) {
      await fetch(`${API_URL}/visitas/${props.visita.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      });
    } else {
      await fetch(`${API_URL}/visitas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      });
    }

    const toast = await toastController.create({
      message: props.visita ? 'Visita actualizada exitosamente' : 'Visita creada exitosamente',
      duration: 2000,
      color: 'success',
    });
    await toast.present();

    emit('save');
  } catch (error) {
    console.error('Error:', error);
    const toast = await toastController.create({
      message: 'Error al guardar la visita',
      duration: 2000,
      color: 'danger',
    });
    await toast.present();
  }
};
</script>

<style scoped>
.visita-modal {
  --width: 95%;
  --max-width: 700px;
  --height: 90%;
  --max-height: 900px;
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

.section-icon-wrapper.orange {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.section-icon-wrapper.teal {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
}

.section-icon-wrapper.red {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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

.form-grid.two-columns {
  grid-template-columns: repeat(2, 1fr);
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

.input-wrapper,
.select-wrapper,
.datetime-wrapper {
  display: flex;
  align-items: center;
  background: #f3f4f6;
  border-radius: 10px;
  padding: 0 12px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.input-wrapper:focus-within,
.select-wrapper:focus-within,
.datetime-wrapper:focus-within {
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
.custom-datetime,
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

.image-preview {
  margin-top: 12px;
  width: 100%;
  height: 150px;
  border-radius: 10px;
  overflow: hidden;
  background: #f3f4f6;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Métricas */
.metrics-form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.metric-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.metric-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-align: center;
}

.metric-input-wrapper {
  display: flex;
  align-items: center;
  background: #f3f4f6;
  border-radius: 10px;
  padding: 0 10px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.metric-input-wrapper:focus-within {
  border-color: #14b8a6;
  background: white;
}

.metric-icon {
  font-size: 16px;
  color: #14b8a6;
  margin-right: 8px;
}

.metric-input {
  --background: transparent;
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 10px;
  --padding-bottom: 10px;
  text-align: center;
  font-weight: 600;
  --color: #1f2937;
}

/* Gastos */
.expenses-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.expense-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.expense-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #6b7280;
}

.expense-label ion-icon {
  font-size: 16px;
  color: #ef4444;
}

.expense-input-wrapper {
  display: flex;
  align-items: center;
  background: #fef2f2;
  border-radius: 10px;
  padding: 0 10px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.expense-input-wrapper:focus-within {
  border-color: #ef4444;
  background: white;
}

.currency {
  font-weight: 600;
  color: #ef4444;
  margin-right: 6px;
}

.expense-input {
  --background: transparent;
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 10px;
  --padding-bottom: 10px;
  font-weight: 600;
  --color: #1f2937;
  flex: 1;
}

.expense-total-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 2px solid #fbbf24;
}

.total-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #92400e;
}

.total-label ion-icon {
  font-size: 16px;
}

.total-amount {
  font-size: 1.3rem;
  font-weight: 700;
  color: #92400e;
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

  .form-grid,
  .form-grid.two-columns {
    grid-template-columns: 1fr;
  }

  .metrics-form-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .expenses-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>