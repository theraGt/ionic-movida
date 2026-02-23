<template>
  <ion-modal :is-open="isOpen" @didDismiss="handleClose" class="voluntario-modal" :backdrop-dismiss="false">
    <ion-header class="modal-header">
      <ion-toolbar>
        <ion-title>
          <div class="title-wrapper">
            <div class="title-icon-container">
              <ion-icon :icon="voluntario ? createOutline : addCircleOutline" class="title-icon"></ion-icon>
            </div>
            <div class="title-text">
              <span class="title-main">{{ voluntario ? 'Editar Voluntario' : 'Nuevo Voluntario' }}</span>
              <span class="title-subtitle">{{ voluntario ? 'Actualizar informacion' : 'Completa el formulario' }}</span>
            </div>
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
        <!-- Datos Basicos -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon-wrapper">
              <ion-icon :icon="idCardOutline"></ion-icon>
            </div>
            <div class="section-title-content">
              <h3 class="section-title">Datos Basicos</h3>
              <span class="section-subtitle">Informacion principal del voluntario</span>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">ID Voluntario <span class="required">*</span></label>
              <div class="input-wrapper">
                <ion-icon :icon="fingerPrintOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.id" placeholder="Ej: Ecuad13076fe4" class="custom-input"
                  :class="{ 'invalid': errors.id }" @ionInput="clearError('id')"></ion-input>
              </div>
              <span v-if="errors.id" class="error-message">{{ errors.id }}</span>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Nombre Completo <span class="required">*</span></label>
              <div class="input-wrapper">
                <ion-icon :icon="personOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.nombreCompleto" placeholder="Nombre completo del voluntario"
                  class="custom-input" :class="{ 'invalid': errors.nombreCompleto }"
                  @ionInput="clearError('nombreCompleto')"></ion-input>
              </div>
              <span v-if="errors.nombreCompleto" class="error-message">{{ errors.nombreCompleto }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Fecha Inscripcion <span class="required">*</span></label>
              <div class="input-wrapper">
                <ion-icon :icon="calendarOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.fechaInscripcion" placeholder="Ej: 27/01/2025" class="custom-input"
                  :class="{ 'invalid': errors.fechaInscripcion }"
                  @ionInput="clearError('fechaInscripcion')"></ion-input>
              </div>
              <span v-if="errors.fechaInscripcion" class="error-message">{{ errors.fechaInscripcion }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Hora Inscripcion <span class="required">*</span></label>
              <div class="input-wrapper">
                <ion-icon :icon="timeOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.horaInscripcion" placeholder="Ej: 19:27:02" class="custom-input"
                  :class="{ 'invalid': errors.horaInscripcion }" @ionInput="clearError('horaInscripcion')"></ion-input>
              </div>
              <span v-if="errors.horaInscripcion" class="error-message">{{ errors.horaInscripcion }}</span>
            </div>
          </div>
        </div>

        <!-- Datos Personales -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon-wrapper">
              <ion-icon :icon="personCircleOutline"></ion-icon>
            </div>
            <div class="section-title-content">
              <h3 class="section-title">Datos Personales</h3>
              <span class="section-subtitle">Informacion de identidad</span>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Pais</label>
              <div class="select-wrapper">
                <ion-icon :icon="flagOutline" class="input-icon"></ion-icon>
                <ion-select v-model="formData.pais" placeholder="Seleccionar pais" interface="popover"
                  class="custom-select">
                  <ion-select-option value="Guatemala">Guatemala</ion-select-option>
                  <ion-select-option value="El Salvador">El Salvador</ion-select-option>
                  <ion-select-option value="Honduras">Honduras</ion-select-option>
                  <ion-select-option value="Nicaragua">Nicaragua</ion-select-option>
                  <ion-select-option value="Costa Rica">Costa Rica</ion-select-option>
                  <ion-select-option value="Panama">Panama</ion-select-option>
                  <ion-select-option value="Ecuador">Ecuador</ion-select-option>
                  <ion-select-option value="Mexico">Mexico</ion-select-option>
                </ion-select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Nacionalidad</label>
              <div class="input-wrapper">
                <ion-icon :icon="earthOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.nacionalidad" placeholder="Ej: Ecuatoriana"
                  class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Documento de Identificacion</label>
              <div class="input-wrapper">
                <ion-icon :icon="cardOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.documentoIdentificacion" placeholder="Numero de documento"
                  class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Fecha de Nacimiento</label>
              <div class="input-wrapper">
                <ion-icon :icon="calendarClearOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.fechaNacimiento" placeholder="Ej: 21/01/1984"
                  class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Edad</label>
              <div class="input-wrapper">
                <ion-icon :icon="hourglassOutline" class="input-icon"></ion-icon>
                <ion-input v-model.number="formData.edad" type="number" placeholder="Ej: 42"
                  class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Genero</label>
              <div class="select-wrapper">
                <ion-icon :icon="maleFemaleOutline" class="input-icon"></ion-icon>
                <ion-select v-model="formData.genero" placeholder="Seleccionar" interface="popover"
                  class="custom-select">
                  <ion-select-option value="Hombre">Hombre</ion-select-option>
                  <ion-select-option value="Mujer">Mujer</ion-select-option>
                </ion-select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Estado Civil</label>
              <div class="select-wrapper">
                <ion-icon :icon="heartOutline" class="input-icon"></ion-icon>
                <ion-select v-model="formData.estadoCivil" placeholder="Seleccionar" interface="popover"
                  class="custom-select">
                  <ion-select-option value="Soltero(a)">Soltero(a)</ion-select-option>
                  <ion-select-option value="Casado(a)">Casado(a)</ion-select-option>
                  <ion-select-option value="Divorciado(a)">Divorciado(a)</ion-select-option>
                  <ion-select-option value="Viudo(a)">Viudo(a)</ion-select-option>
                </ion-select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Profesion u Oficio</label>
              <div class="input-wrapper">
                <ion-icon :icon="briefcaseOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.profesionOficio" placeholder="Ej: Docencia"
                  class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Ocupacion</label>
              <div class="input-wrapper">
                <ion-icon :icon="businessOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.ocupacion" placeholder="Ej: Trabajador" class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Telefono</label>
              <div class="input-wrapper">
                <ion-icon :icon="callOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.telefono" placeholder="Ej: 593994007870" class="custom-input"></ion-input>
              </div>
            </div>
          </div>
        </div>

        <!-- Ubicacion -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon-wrapper">
              <ion-icon :icon="locationOutline"></ion-icon>
            </div>
            <div class="section-title-content">
              <h3 class="section-title">Ubicacion</h3>
              <span class="section-subtitle">Direccion y zona</span>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label">Departamento o Region</label>
              <div class="input-wrapper">
                <ion-icon :icon="mapOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.departamentoRegion" placeholder="Ej: Costa"
                  class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Municipio o Provincia</label>
              <div class="input-wrapper">
                <ion-icon :icon="navigateOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.municipioProvincia" placeholder="Ej: Guayas"
                  class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Ciudad</label>
              <div class="input-wrapper">
                <ion-icon :icon="homeOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.ciudad" placeholder="Ej: Guayaquil" class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Grado Academico</label>
              <div class="input-wrapper">
                <ion-icon :icon="schoolOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.gradoAcademico" placeholder="Ej: Universidad"
                  class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Estudios Adicionales</label>
              <div class="input-wrapper">
                <ion-icon :icon="libraryOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.estudiosAdicionales" placeholder="Ej: Maestria"
                  class="custom-input"></ion-input>
              </div>
            </div>
          </div>
        </div>

        <!-- Contacto Digital -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon-wrapper">
              <ion-icon :icon="globeOutline"></ion-icon>
            </div>
            <div class="section-title-content">
              <h3 class="section-title">Contacto Digital</h3>
              <span class="section-subtitle">Redes sociales y correo</span>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label">Correo Electronico</label>
              <div class="input-wrapper">
                <ion-icon :icon="mailOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.correo" type="email" placeholder="Ej: correo@ejemplo.com"
                  class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Facebook</label>
              <div class="input-wrapper">
                <ion-icon :icon="logoFacebook" class="input-icon"></ion-icon>
                <ion-input v-model="formData.facebook" placeholder="URL de Facebook" class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Instagram</label>
              <div class="input-wrapper">
                <ion-icon :icon="logoInstagram" class="input-icon"></ion-icon>
                <ion-input v-model="formData.instagram" placeholder="URL de Instagram" class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group full-width">
              <label class="form-label">TikTok</label>
              <div class="input-wrapper">
                <ion-icon :icon="musicalNotesOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.tiktok" placeholder="URL de TikTok" class="custom-input"></ion-input>
              </div>
            </div>
          </div>
        </div>

        <!-- Informacion de Iglesia -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon-wrapper">
              <ion-icon :icon="businessOutline"></ion-icon>
            </div>
            <div class="section-title-content">
              <h3 class="section-title">Informacion de Iglesia</h3>
              <span class="section-subtitle">Datos eclesiasticos</span>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label">Iglesia</label>
              <div class="input-wrapper">
                <ion-icon :icon="businessOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.iglesia" placeholder="Nombre de la iglesia"
                  class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Pastor</label>
              <div class="input-wrapper">
                <ion-icon :icon="personOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.pastor" placeholder="Nombre del pastor" class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Contacto Pastor</label>
              <div class="input-wrapper">
                <ion-icon :icon="callOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.contactoPastor" placeholder="Telefono del pastor"
                  class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Denominacion</label>
              <div class="input-wrapper">
                <ion-icon :icon="gitBranchOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.denominacion" placeholder="Ej: Pentecostal"
                  class="custom-input"></ion-input>
              </div>
            </div>
          </div>
        </div>

        <!-- Areas de Servicio -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon-wrapper">
              <ion-icon :icon="handLeftOutline"></ion-icon>
            </div>
            <div class="section-title-content">
              <h3 class="section-title">Areas de Servicio</h3>
              <span class="section-subtitle">Donaciones y talentos</span>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label">Areas de Servicio</label>
              <div class="input-wrapper">
                <ion-icon :icon="listOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.areasServicio" placeholder="Ej: Misiones, Logistica"
                  class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Dones y Talentos</label>
              <div class="input-wrapper">
                <ion-icon :icon="starOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.donesTalentos" placeholder="Ej: Musico, Predicador"
                  class="custom-input"></ion-input>
              </div>
            </div>
          </div>
        </div>

        <!-- Capacitacion -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon-wrapper">
              <ion-icon :icon="bookOutline"></ion-icon>
            </div>
            <div class="section-title-content">
              <h3 class="section-title">Capacitacion</h3>
              <span class="section-subtitle">Cursos y certificaciones</span>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Curso Storyline</label>
              <div class="select-wrapper">
                <ion-icon :icon="checkmarkCircleOutline" class="input-icon"></ion-icon>
                <ion-select v-model="formData.cursoStoryline" interface="popover" class="custom-select">
                  <ion-select-option value="SI">SI</ion-select-option>
                  <ion-select-option value="NO">NO</ion-select-option>
                </ion-select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Diploma Storyline</label>
              <div class="input-wrapper">
                <ion-icon :icon="documentOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.diplomaStoryline" placeholder="Info del diploma"
                  class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Curso Vaya a Movilizar</label>
              <div class="select-wrapper">
                <ion-icon :icon="checkmarkCircleOutline" class="input-icon"></ion-icon>
                <ion-select v-model="formData.cursoVayaMovilizar" interface="popover" class="custom-select">
                  <ion-select-option value="SI">SI</ion-select-option>
                  <ion-select-option value="NO">NO</ion-select-option>
                </ion-select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Diploma Vaya Movilizar</label>
              <div class="input-wrapper">
                <ion-icon :icon="documentOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.diplomaVayaMovilizar" placeholder="Info del diploma"
                  class="custom-input"></ion-input>
              </div>
            </div>
          </div>
        </div>

        <!-- Experiencia en CIMA -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon-wrapper">
              <ion-icon :icon="trophyOutline"></ion-icon>
            </div>
            <div class="section-title-content">
              <h3 class="section-title">Experiencia en CIMA</h3>
              <span class="section-subtitle">Historial de participacion</span>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label">CIMAs Asistidos</label>
              <div class="input-wrapper">
                <ion-icon :icon="calendarNumberOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.cimasAsistidos" placeholder="Ej: CIMA 2024 El Legado - Ecuador"
                  class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Areas de Servicio en CIMA</label>
              <div class="input-wrapper">
                <ion-icon :icon="constructOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.areasServicioCima" placeholder="Ej: Logistica"
                  class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Programas Participados</label>
              <div class="input-wrapper">
                <ion-icon :icon="layersOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.programasParticipados" placeholder="Ej: Cima, Cima Day, Sigue"
                  class="custom-input"></ion-input>
              </div>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Tipo de Voluntariado</label>
              <div class="input-wrapper">
                <ion-icon :icon="peopleCircleOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.tipoVoluntariado" placeholder="Ej: Voluntario"
                  class="custom-input"></ion-input>
              </div>
            </div>
          </div>
        </div>

        <!-- Documentos -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon-wrapper">
              <ion-icon :icon="documentTextOutline"></ion-icon>
            </div>
            <div class="section-title-content">
              <h3 class="section-title">Documentos</h3>
              <span class="section-subtitle">Testimonio y cartas</span>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label">Testimonio</label>
              <ion-textarea v-model="formData.testimonio" placeholder="Testimonio del voluntario..." :rows="3"
                class="custom-textarea"></ion-textarea>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Carta Pastoral</label>
              <ion-textarea v-model="formData.cartaPastoral" placeholder="Contenido de la carta pastoral..." :rows="3"
                class="custom-textarea"></ion-textarea>
            </div>
          </div>
        </div>

        <!-- Foto -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon-wrapper">
              <ion-icon :icon="imageOutline"></ion-icon>
            </div>
            <div class="section-title-content">
              <h3 class="section-title">Fotografia</h3>
              <span class="section-subtitle">Imagen del voluntario</span>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label">URL de la Foto</label>
              <div class="input-wrapper">
                <ion-icon :icon="linkOutline" class="input-icon"></ion-icon>
                <ion-input v-model="formData.foto" placeholder="Ej: Voluntarios_Images/Ecuad13076fe4.FOTO.011510.jpg"
                  class="custom-input"></ion-input>
              </div>
            </div>
          </div>
        </div>

        <!-- Datos Completos -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon-wrapper">
              <ion-icon :icon="informationCircleOutline"></ion-icon>
            </div>
            <div class="section-title-content">
              <h3 class="section-title">Estado</h3>
              <span class="section-subtitle">Completitud de datos</span>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label">Datos Completos</label>
              <div class="select-wrapper">
                <ion-icon :icon="checkmarkDoneOutline" class="input-icon"></ion-icon>
                <ion-select v-model="formData.datosCompletos" interface="popover" class="custom-select">
                  <ion-select-option value="SI">SI</ion-select-option>
                  <ion-select-option value="NO">NO</ion-select-option>
                </ion-select>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones de Accion -->
        <div class="form-actions">
          <ion-button type="button" fill="outline" color="medium" @click="handleClose" class="cancel-button">
            <ion-icon slot="start" :icon="closeOutline"></ion-icon>
            Cancelar
          </ion-button>
          <ion-button type="submit" class="save-button">
            <ion-icon slot="start" :icon="checkmarkOutline"></ion-icon>
            {{ voluntario ? 'Guardar Cambios' : 'Crear Voluntario' }}
          </ion-button>
        </div>
      </form>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons,
  IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea,
  IonSpinner, toastController, IonIcon
} from '@ionic/vue';
import {
  closeOutline,
  createOutline,
  addCircleOutline,
  checkmarkOutline,
  idCardOutline,
  fingerPrintOutline,
  personOutline,
  calendarOutline,
  timeOutline,
  flagOutline,
  earthOutline,
  cardOutline,
  calendarClearOutline,
  hourglassOutline,
  maleFemaleOutline,
  heartOutline,
  briefcaseOutline,
  businessOutline,
  callOutline,
  locationOutline,
  mapOutline,
  navigateOutline,
  homeOutline,
  schoolOutline,
  libraryOutline,
  globeOutline,
  mailOutline,
  logoFacebook,
  logoInstagram,
  musicalNotesOutline,
  gitBranchOutline,
  handLeftOutline,
  listOutline,
  starOutline,
  bookOutline,
  checkmarkCircleOutline,
  documentOutline,
  trophyOutline,
  calendarNumberOutline,
  constructOutline,
  layersOutline,
  peopleCircleOutline,
  documentTextOutline,
  imageOutline,
  linkOutline,
  informationCircleOutline,
  checkmarkDoneOutline,
  personCircleOutline
} from 'ionicons/icons';
import { Voluntario } from '../../types/voluntario';
import { blink } from '../../lib/blink';

const props = defineProps<{
  isOpen: boolean;
  voluntario?: Voluntario | null;
}>();

const emit = defineEmits(['close', 'save']);
const submitting = ref(false);

const errors = reactive<Record<string, string>>({});

const defaultValues: Partial<Voluntario> = {
  id: '',
  fechaInscripcion: '',
  horaInscripcion: '',
  nombreCompleto: '',
  pais: '',
  nacionalidad: '',
  documentoIdentificacion: '',
  fechaNacimiento: '',
  edad: 0,
  genero: '',
  profesionOficio: '',
  ocupacion: '',
  telefono: '',
  estadoCivil: '',
  departamentoRegion: '',
  municipioProvincia: '',
  ciudad: '',
  gradoAcademico: '',
  estudiosAdicionales: '',
  correo: '',
  facebook: '',
  instagram: '',
  tiktok: '',
  iglesia: '',
  pastor: '',
  contactoPastor: '',
  denominacion: '',
  areasServicio: '',
  donesTalentos: '',
  cursoStoryline: 'NO',
  diplomaStoryline: '',
  cursoVayaMovilizar: 'NO',
  diplomaVayaMovilizar: '',
  cimasAsistidos: '',
  areasServicioCima: '',
  programasParticipados: '',
  tipoVoluntariado: '',
  testimonio: '',
  cartaPastoral: '',
  foto: '',
  datosCompletos: 'NO',
};

const formData = ref<Partial<Voluntario>>({ ...defaultValues });

const clearError = (field: string) => {
  delete errors[field];
};

const clearAllErrors = () => {
  Object.keys(errors).forEach(key => delete errors[key]);
};

const validateForm = (): boolean => {
  clearAllErrors();
  let isValid = true;

  if (!formData.value.id || formData.value.id.trim() === '') {
    errors.id = 'El ID del voluntario es requerido';
    isValid = false;
  }

  if (!formData.value.nombreCompleto || formData.value.nombreCompleto.trim() === '') {
    errors.nombreCompleto = 'El nombre completo es requerido';
    isValid = false;
  }

  if (!formData.value.fechaInscripcion) {
    errors.fechaInscripcion = 'La fecha de inscripcion es requerida';
    isValid = false;
  }

  if (!formData.value.horaInscripcion) {
    errors.horaInscripcion = 'La hora de inscripcion es requerida';
    isValid = false;
  }

  return isValid;
};

const handleClose = () => {
  clearAllErrors();
  emit('close');
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    clearAllErrors();
    if (props.voluntario) {
      formData.value = {
        ...defaultValues,
        ...props.voluntario
      };
    } else {
      formData.value = { ...defaultValues };
    }
  }
});

const showToast = async (msg: string, color: 'success' | 'danger' | 'warning') => {
  const toast = await toastController.create({
    message: msg,
    duration: 2000,
    color: color
  });
  await toast.present();
};

const handleSubmit = async () => {
  if (!validateForm()) {
    await showToast('Por favor complete todos los campos requeridos', 'warning');
    return;
  }

  try {
    submitting.value = true;
    if (props.voluntario) {
      await blink.db.voluntarios.update(props.voluntario.id, {
        ...formData.value
      });
      await showToast('Voluntario actualizado correctamente', 'success');
    } else {
      await blink.db.voluntarios.create({
        ...formData.value,
      });
      await showToast('Voluntario creado correctamente', 'success');
    }
    emit('save');
    emit('close');
  } catch (error) {
    console.error(error);
    await showToast('Error al guardar el voluntario', 'danger');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.voluntario-modal {
  --width: 95%;
  --max-width: 800px;
  --height: 90%;
  --max-height: 95vh;
  --border-radius: 24px;
  --box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  --background: linear-gradient(135deg, #e8913a 0%, #d67d2a 100%);
}

.modal-header ion-toolbar {
  --background: transparent;
  --color: white;
  --padding-top: 16px;
  --padding-bottom: 16px;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-icon-container {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.title-icon {
  font-size: 28px;
  color: white;
}

.title-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.title-main {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  letter-spacing: -0.025em;
}

.title-subtitle {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
}

.close-button {
  --color: white;
  --background: rgba(255, 255, 255, 0.15);
  --background-hover: rgba(255, 255, 255, 0.25);
  --border-radius: 50%;
  width: 40px;
  height: 40px;
}

.modal-content {
  --background: #f8fafc;
}

.form-container {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: box-shadow 0.2s ease;
}

.form-section:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #fef3c7;
}

.section-icon-wrapper {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #e8913a 0%, #f59e0b 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 6px -1px rgba(232, 145, 58, 0.3);
}

.section-title-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.section-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: -0.025em;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 400;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 4px;
}

.required {
  color: #ef4444;
  font-weight: 600;
}

.input-wrapper,
.select-wrapper {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border-radius: 12px;
  padding: 0 16px;
  border: 2px solid #e2e8f0;
  transition: all 0.2s ease;
  height: 48px;
}

.input-wrapper:hover,
.select-wrapper:hover {
  border-color: #cbd5e1;
  background: #f1f5f9;
}

.input-wrapper:focus-within,
.select-wrapper:focus-within {
  border-color: #e8913a;
  background: white;
  box-shadow: 0 0 0 4px rgba(232, 145, 58, 0.1);
}

.input-icon {
  font-size: 20px;
  color: #94a3b8;
  margin-right: 12px;
  flex-shrink: 0;
}

.custom-input,
.custom-select {
  --background: transparent;
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  --placeholder-color: #94a3b8;
  --color: #1e293b;
  flex: 1;
  font-size: 0.95rem;
  font-weight: 500;
}

.custom-input.invalid {
  --color: #ef4444;
}

.custom-textarea {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  --placeholder-color: #94a3b8;
  --color: #1e293b;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.custom-textarea:hover {
  border-color: #cbd5e1;
  background: #f1f5f9;
}

.custom-textarea:focus-within {
  border-color: #e8913a;
  background: white;
  box-shadow: 0 0 0 4px rgba(232, 145, 58, 0.1);
}

.error-message {
  font-size: 0.75rem;
  color: #ef4444;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.error-message::before {
  content: '⚠';
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 24px;
  border-top: 2px solid #e2e8f0;
  margin-top: 8px;
}

.cancel-button {
  --border-radius: 12px;
  --padding-start: 24px;
  --padding-end: 24px;
  --border-color: #cbd5e1;
  --color: #64748b;
  font-weight: 600;
  height: 48px;
  text-transform: none;
  font-size: 0.95rem;
}

.cancel-button:hover {
  --border-color: #94a3b8;
  --color: #475569;
}

.save-button {
  --background: linear-gradient(135deg, #e8913a 0%, #d67d2a 100%);
  --background-hover: linear-gradient(135deg, #d67d2a 0%, #c46a1f 100%);
  --border-radius: 12px;
  --padding-start: 28px;
  --padding-end: 28px;
  font-weight: 600;
  height: 48px;
  text-transform: none;
  font-size: 0.95rem;
  --box-shadow: 0 4px 6px -1px rgba(232, 145, 58, 0.4);
}

.save-button:hover {
  --box-shadow: 0 8px 12px -2px rgba(232, 145, 58, 0.5);
}

@media (max-width: 640px) {
  .voluntario-modal {
    --width: 100%;
    --height: 100%;
    --border-radius: 0;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-container {
    padding: 16px;
  }

  .form-section {
    padding: 20px;
  }

  .title-wrapper {
    gap: 12px;
  }

  .title-icon-container {
    width: 40px;
    height: 40px;
  }

  .title-main {
    font-size: 1.1rem;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .cancel-button,
  .save-button {
    width: 100%;
  }
}

/* Scrollbar personalizado */
ion-content::part(scroll) {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

ion-content::part(scroll)::-webkit-scrollbar {
  width: 8px;
}

ion-content::part(scroll)::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

ion-content::part(scroll)::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

ion-content::part(scroll)::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Dark Mode */
.dark .voluntario-modal {
  --background: #1f2937;
}

.dark .modal-header {
  --background: linear-gradient(135deg, #f0a85a 0%, #d3944f 100%);
}

.dark .modal-header ion-toolbar {
  --color: #1f2937;
}

.dark .title-main {
  color: #1f2937;
}

.dark .title-subtitle {
  color: #4b5563;
}

.dark .close-button {
  --color: #1f2937;
  --background: rgba(31, 41, 55, 0.15);
  --background-hover: rgba(31, 41, 55, 0.25);
}

.dark .modal-content {
  --background: #111827;
}

.dark .form-section {
  background: #1f2937;
  border-color: #374151;
}

.dark .section-header {
  border-bottom-color: #451a03;
}

.dark .section-title {
  color: #f3f4f6;
}

.dark .section-subtitle {
  color: #9ca3af;
}

.dark .form-label {
  color: #d1d5db;
}

.dark .input-wrapper,
.dark .select-wrapper {
  background: #374151;
  border-color: #4b5563;
}

.dark .input-wrapper:hover,
.dark .select-wrapper:hover {
  border-color: #6b7280;
  background: #4b5563;
}

.dark .input-wrapper:focus-within,
.dark .select-wrapper:focus-within {
  background: #1f2937;
}

.dark .input-icon {
  color: #6b7280;
}

.dark .custom-input,
.dark .custom-select {
  --placeholder-color: #6b7280;
  --color: #f3f4f6;
}

.dark .custom-textarea {
  background: #374151;
  border-color: #4b5563;
  --placeholder-color: #6b7280;
  --color: #f3f4f6;
}

.dark .custom-textarea:hover {
  background: #4b5563;
}

.dark .custom-textarea:focus-within {
  background: #1f2937;
}

.dark .form-actions {
  border-top-color: #374151;
}

.dark ion-content::part(scroll) {
  scrollbar-color: #4b5563 #1f2937;
}

.dark ion-content::part(scroll)::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark ion-content::part(scroll)::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark ion-content::part(scroll)::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
