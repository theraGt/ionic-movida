<template>
  <ion-page>
    <div class="dashboard-wrapper">
      <Sidebar />
      
      <div class="main-container">
        <Header />
        
        <ion-content>
          <main class="content-padding">
            <div class="page-title-row">
              <h1 class="page-title">Generador de Noticias</h1>
              <div class="actions-group">
                <ion-button 
                  fill="solid" 
                  color="primary"
                  :disabled="visitasSeleccionadas.length === 0 || generando"
                  @click="generarNoticiasIA"
                >
                  <ion-icon :icon="sparkles" slot="start"></ion-icon>
                  {{ generando ? 'Generando...' : 'Generar con IA' }}
                </ion-button>
                
                <ion-button 
                  fill="outline" 
                  color="medium"
                  @click="abrirConfiguracion"
                >
                  <ion-icon :icon="settingsOutline" slot="start"></ion-icon>
                  Configurar
                </ion-button>
                
                <ion-button 
                  fill="solid" 
                  color="success"
                  :disabled="noticiasGeneradas.length === 0"
                  @click="descargarPDF"
                >
                  <ion-icon :icon="downloadOutline" slot="start"></ion-icon>
                  Descargar PDF
                </ion-button>
              </div>
            </div>

            <div class="dashboard-grid">
              <!-- Panel Izquierdo: Lista de Visitas -->
              <aside class="filter-panel">
                <div class="filter-panel-header">
                  <h3>Seleccionar Visitas</h3>
                  <div class="header-actions">
                    <ion-badge color="primary">{{ visitasSeleccionadas.length }} seleccionadas</ion-badge>
                    <ion-button size="small" fill="solid" color="primary" @click="abrirModalAgregar">
                      <ion-icon :icon="addOutline" slot="start"></ion-icon>
                      Agregar
                    </ion-button>
                  </div>
                </div>
                <div class="filter-panel-content">
                  <ion-searchbar 
                    v-model="busqueda" 
                    placeholder="Buscar visitas..."
                    class="search-bar"
                  ></ion-searchbar>
                  
                  <ion-list class="visitas-list">
                    <ion-item 
                      v-for="visita in visitasFiltradas" 
                      :key="visita.id"
                      :class="{ 'seleccionada': visitasSeleccionadas.includes(visita.id) }"
                      button
                      @click="toggleSeleccion(visita)"
                    >
                      <ion-checkbox 
                        slot="start" 
                        :checked="visitasSeleccionadas.includes(visita.id)"
                        @ionChange="toggleSeleccion(visita)"
                        @click.stop
                      ></ion-checkbox>
                      <ion-label>
                        <h3>{{ visita.actividad }}</h3>
                        <p>{{ visita.fecha }} | {{ visita.pais }}</p>
                        <ion-badge :color="getEstadoColor(visita.estado)" class="estado-badge">
                          {{ visita.estado }}
                        </ion-badge>
                      </ion-label>
                      <div class="item-actions">
                        <ion-icon 
                          v-if="noticiasMap.has(visita.id)" 
                          :icon="checkmarkCircle" 
                          color="success" 
                          slot="end"
                        ></ion-icon>
                        <ion-button 
                          fill="clear" 
                          size="small" 
                          @click.stop="editarVisita(visita)"
                        >
                          <ion-icon :icon="createOutline" slot="icon-only"></ion-icon>
                        </ion-button>
                      </div>
                    </ion-item>
                  </ion-list>
                  
                  <div v-if="visitas.length === 0" class="empty-state">
                    <ion-icon :icon="newspaperOutline" class="empty-icon"></ion-icon>
                    <p>No hay visitas disponibles</p>
                  </div>
                </div>
              </aside>

              <!-- Panel Derecho: Vista Previa -->
              <section class="preview-section">
                <div class="preview-header">
                  <h2>Vista Previa del Boletín</h2>
                  <div class="header-badges">
                    <ion-badge v-if="proveedorUsado" color="tertiary" class="provider-badge">
                      {{ proveedorUsado === 'groq' ? '⚡ Groq' : '🌐 OpenRouter' }}
                    </ion-badge>
                    <ion-badge v-if="noticiasGeneradas.length > 0" color="success">
                      {{ noticiasGeneradas.length }} noticias
                    </ion-badge>
                  </div>
                </div>

                <!-- Loading -->
                <div v-if="generando" class="loading-container">
                  <ion-spinner name="crescent" class="loading-spinner"></ion-spinner>
                  <p class="loading-text">Generando noticias con IA...</p>
                  <p class="loading-subtext">Esto puede tomar unos segundos</p>
                </div>

                <!-- PDF Preview -->
                <div v-else-if="noticiasGeneradas.length > 0" class="pdf-preview-container">
                  <div id="pdf-content" class="pdf-content">
                    <!-- 1. PORTADA - Estilo Minimalista -->
                    <div 
                      class="portada-section" 
                      :style="portadaImagen ? { backgroundImage: `url(${portadaImagen})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: portadaColorFondo }"
                    >
                      <div class="portada-content" :class="{ 'portada-content-oscuro': portadaImagen }">
                        <div class="portada-header">
                          <h1 class="portada-titulo-principal">CARTA</h1>
                          <h1 class="portada-titulo-secundario">DE NOTICIAS</h1>
                          <p class="portada-fecha">{{ fechaMesAnio }}</p>
                        </div>
                        
                        <div class="portada-ondas">
                          <svg viewBox="0 0 200 40" class="ondas-svg">
                            <path d="M0,20 Q25,5 50,20 T100,20 T150,20 T200,20" fill="none" stroke="#1a1a1a" stroke-width="2"/>
                            <path d="M0,30 Q25,15 50,30 T100,30 T150,30 T200,30" fill="none" stroke="#1a1a1a" stroke-width="2"/>
                          </svg>
                        </div>

                        <div class="portada-subtitulo">
                          <h2 class="portada-nombre">Movida</h2>
                        </div>

                        <div class="portada-divider"></div>
                      </div>
                    </div>

                    <!-- 2. NOTICIAS -->
                    <div class="seccion-noticias">
                      <div class="seccion-header">
                        <h2 class="seccion-titulo">Noticias y Actividades</h2>
                        <div class="seccion-linea"></div>
                      </div>
                      
                      <div 
                        v-for="(noticia, index) in noticiasGeneradas" 
                        :key="index"
                        class="noticia-item"
                      >
                        <div class="noticia-header">
                          <span class="noticia-categoria">{{ noticia.categoria }}</span>
                          <h3 class="noticia-titulo">{{ noticia.titulo }}</h3>
                          <p class="noticia-resumen">{{ noticia.resumen }}</p>
                        </div>
                        
                        <div class="noticia-contenido">
                          <p v-for="(parrafo, pIndex) in formatearParrafos(noticia.contenido)" :key="pIndex">
                            {{ parrafo }}
                          </p>
                        </div>

                        <div v-if="index < noticiasGeneradas.length - 1" class="noticia-divider"></div>
                      </div>
                    </div>

                    <!-- 3. COLLAGE DE IMÁGENES -->
                    <div class="seccion-imagenes">
                      <div class="seccion-header">
                        <h2 class="seccion-titulo">Momentos Destacados</h2>
                        <div class="seccion-linea"></div>
                      </div>
                      <div class="collage-container">
                        <div class="collage-grid">
                          <div class="collage-item collage-item-1">
                            <div class="imagen-placeholder">
                              <ion-icon :icon="imageOutline" class="imagen-icono"></ion-icon>
                              <span>Imagen 1</span>
                            </div>
                          </div>
                          <div class="collage-item collage-item-2">
                            <div class="imagen-placeholder">
                              <ion-icon :icon="imageOutline" class="imagen-icono"></ion-icon>
                              <span>Imagen 2</span>
                            </div>
                          </div>
                          <div class="collage-item collage-item-3">
                            <div class="imagen-placeholder">
                              <ion-icon :icon="imageOutline" class="imagen-icono"></ion-icon>
                              <span>Imagen 3</span>
                            </div>
                          </div>
                          <div class="collage-item collage-item-4">
                            <div class="imagen-placeholder">
                              <ion-icon :icon="imageOutline" class="imagen-icono"></ion-icon>
                              <span>Imagen 4</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 4. AGRADECIMIENTOS -->
                    <div class="seccion-agradecimientos">
                      <div class="seccion-header">
                        <h2 class="seccion-titulo">Agradecimientos</h2>
                        <div class="seccion-linea"></div>
                      </div>
                      <div class="agradecimientos-content">
                        <p class="agradecimiento-texto">
                          Queremos expresar nuestro más sincero agradecimiento a todos los voluntarios, 
                          donantes y colaboradores que hacen posible nuestra labor. Su apoyo incondicional 
                          y dedicación son fundamentales para llevar esperanza y transformación a las comunidades.
                        </p>
                        <p class="agradecimiento-texto">
                          Gracias por creer en nuestra misión y ser parte de este hermoso proyecto de vida.
                        </p>
                      </div>
                    </div>

                    <!-- 5. PUNTOS DE ORACIÓN Y APOYO -->
                    <div class="seccion-oracion">
                      <div class="seccion-header">
                        <h2 class="seccion-titulo">Puntos de Oración y Apoyo</h2>
                        <div class="seccion-linea"></div>
                      </div>
                      <div class="oracion-content">
                        <ul class="oracion-lista">
                          <li class="oracion-item">
                            <ion-icon :icon="heartOutline" class="oracion-icono"></ion-icon>
                            <span>Por los voluntarios y su dedicación en cada actividad</span>
                          </li>
                          <li class="oracion-item">
                            <ion-icon :icon="heartOutline" class="oracion-icono"></ion-icon>
                            <span>Por las comunidades que servimos y sus necesidades</span>
                          </li>
                          <li class="oracion-item">
                            <ion-icon :icon="heartOutline" class="oracion-icono"></ion-icon>
                            <span>Por los recursos necesarios para continuar nuestra labor</span>
                          </li>
                          <li class="oracion-item">
                            <ion-icon :icon="heartOutline" class="oracion-icono"></ion-icon>
                            <span>Por la salud y protección de todos los miembros del equipo</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <!-- 6. OFRENDAS Y CONTACTO -->
                    <div class="seccion-contacto">
                      <div class="seccion-header">
                        <h2 class="seccion-titulo">Ofrendas y Contacto</h2>
                        <div class="seccion-linea"></div>
                      </div>
                      <div class="contacto-content">
                        <div class="ofrendas-section">
                          <h3 class="contacto-subtitulo">¿Cómo apoyar?</h3>
                          <p class="contacto-texto">
                            Tu contribución nos permite continuar llevando esperanza y ayuda a quienes más lo necesitan.
                          </p>
                          <div class="ofrenda-info">
                            <div class="ofrenda-item">
                              <ion-icon :icon="cashOutline" class="ofrenda-icono"></ion-icon>
                              <span>Transferencia bancaria</span>
                            </div>
                            <div class="ofrenda-item">
                              <ion-icon :icon="cardOutline" class="ofrenda-icono"></ion-icon>
                              <span>Donación en línea</span>
                            </div>
                            <div class="ofrenda-item">
                              <ion-icon :icon="giftOutline" class="ofrenda-icono"></ion-icon>
                              <span>Bienes materiales</span>
                            </div>
                          </div>
                        </div>
                        <div class="contacto-info">
                          <h3 class="contacto-subtitulo">Contáctanos</h3>
                          <div class="contacto-detalles">
                            <div class="contacto-item">
                              <ion-icon :icon="mailOutline" class="contacto-icono"></ion-icon>
                              <span>info@movida.org</span>
                            </div>
                            <div class="contacto-item">
                              <ion-icon :icon="callOutline" class="contacto-icono"></ion-icon>
                              <span>+502 1234-5678</span>
                            </div>
                            <div class="contacto-item">
                              <ion-icon :icon="locationOutline" class="contacto-icono"></ion-icon>
                              <span>Ciudad de Guatemala, Guatemala</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Pie de página -->
                    <div class="boletin-footer">
                      <div class="footer-divider"></div>
                      <p class="footer-mensaje">Gracias por ser parte de nuestra misión</p>
                      <p class="footer-fecha">{{ fechaActual }}</p>
                      <p class="footer-web">www.movida.org</p>
                    </div>
                  </div>
                </div>

                <!-- Estado Vacío -->
                <div v-else class="empty-preview">
                  <ion-icon :icon="documentTextOutline" class="empty-preview-icon"></ion-icon>
                  <h3>Sin contenido para mostrar</h3>
                  <p>Selecciona visitas y genera noticias con IA para ver la vista previa</p>
                </div>
              </section>
            </div>

            <!-- Modal de Error -->
            <ion-modal :is-open="mostrarError" @didDismiss="cerrarError">
              <ion-header>
                <ion-toolbar color="danger">
                  <ion-title>Error</ion-title>
                  <ion-buttons slot="end">
                    <ion-button @click="cerrarError">Cerrar</ion-button>
                  </ion-buttons>
                </ion-toolbar>
              </ion-header>
              <ion-content class="ion-padding">
                <p>{{ mensajeError }}</p>
              </ion-content>
            </ion-modal>

            <!-- Modal de Configuración de Portada -->
            <ion-modal :is-open="mostrarConfiguracion" @didDismiss="cerrarConfiguracion">
              <ion-header>
                <ion-toolbar color="primary">
                  <ion-title>Configurar Portada</ion-title>
                  <ion-buttons slot="end">
                    <ion-button @click="cerrarConfiguracion">Cerrar</ion-button>
                  </ion-buttons>
                </ion-toolbar>
              </ion-header>
              <ion-content class="ion-padding">
                <div class="config-section">
                  <h3>Color de Fondo</h3>
                  <div class="color-options">
                    <div 
                      v-for="color in coloresPortada" 
                      :key="color.value"
                      class="color-option"
                      :class="{ selected: portadaColorFondo === color.value }"
                      :style="{ background: color.value }"
                      @click="seleccionarColor(color.value)"
                    >
                      <ion-icon v-if="portadaColorFondo === color.value" :icon="checkmark" class="color-check"></ion-icon>
                    </div>
                  </div>
                  <p class="color-name">{{ obtenerNombreColor(portadaColorFondo) }}</p>
                </div>

                <div class="config-section">
                  <h3>Imagen de Fondo</h3>
                  <input 
                    type="file" 
                    accept="image/*" 
                    @change="subirImagen"
                    class="file-input"
                  />
                  <div v-if="portadaImagen" class="imagen-preview">
                    <img :src="portadaImagen" alt="Preview" />
                    <ion-button fill="clear" color="danger" @click="eliminarImagen">
                      <ion-icon :icon="trashOutline" slot="start"></ion-icon>
                      Eliminar
                    </ion-button>
                  </div>
                </div>

                <div class="config-section">
                  <h3>Vista Previa</h3>
                  <div class="preview-mini">
                    <div 
                      class="preview-portada-mini"
                      :style="portadaImagen ? { backgroundImage: `url(${portadaImagen})`, backgroundSize: 'cover' } : { background: portadaColorFondo }"
                    >
                      <div class="preview-mini-content" :class="{ 'oscuro': portadaImagen }">
                        <span class="preview-mini-titulo">CARTA DE NOTICIAS</span>
                        <span class="preview-mini-nombre">Movida</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ion-content>
            </ion-modal>

            <!-- Modal Agregar/Editar Visita -->
            <ion-modal :is-open="mostrarModalVisita" @didDismiss="cerrarModalVisita" class="modal-visita">
              <ion-header>
                <ion-toolbar :color="editandoVisita ? 'medium' : 'primary'">
                  <ion-title>{{ editandoVisita ? 'Editar' : 'Agregar' }} Visita</ion-title>
                  <ion-buttons slot="end">
                    <ion-button @click="cerrarModalVisita">Cerrar</ion-button>
                  </ion-buttons>
                </ion-toolbar>
              </ion-header>
              <ion-content class="ion-padding">
                <div class="form-group">
                  <label>Fecha *</label>
                  <ion-input v-model="visitaForm.fecha" type="date" placeholder="Seleccionar fecha"></ion-input>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Hora Inicio *</label>
                    <ion-input v-model="visitaForm.horaInicio" type="time" placeholder="09:00"></ion-input>
                  </div>
                  <div class="form-group">
                    <label>Hora Fin *</label>
                    <ion-input v-model="visitaForm.horaFin" type="time" placeholder="12:00"></ion-input>
                  </div>
                </div>

                <div class="form-group">
                  <label>Actividad *</label>
                  <ion-input v-model="visitaForm.actividad" type="text" placeholder="Descripción de la actividad"></ion-input>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Tipo *</label>
                    <ion-select v-model="visitaForm.tipo" placeholder="Seleccionar tipo">
                      <ion-select-option value="Voluntariado">Voluntariado</ion-select-option>
                      <ion-select-option value="Educación">Educación</ion-select-option>
                      <ion-select-option value="Medio Ambiente">Medio Ambiente</ion-select-option>
                      <ion-select-option value="Salud">Salud</ion-select-option>
                      <ion-select-option value="Comunidad">Comunidad</ion-select-option>
                      <ion-select-option value="Otro">Otro</ion-select-option>
                    </ion-select>
                  </div>
                  <div class="form-group">
                    <label>Estado *</label>
                    <ion-select v-model="visitaForm.estado" placeholder="Seleccionar estado">
                      <ion-select-option value="Completada">Completada</ion-select-option>
                      <ion-select-option value="Pendiente">Pendiente</ion-select-option>
                      <ion-select-option value="En progreso">En progreso</ion-select-option>
                      <ion-select-option value="Cancelada">Cancelada</ion-select-option>
                    </ion-select>
                  </div>
                </div>

                <div class="form-group">
                  <label>País *</label>
                  <ion-input v-model="visitaForm.pais" type="text" placeholder="Guatemala"></ion-input>
                </div>

                <div class="form-group">
                  <label>Comentarios</label>
                  <ion-textarea v-model="visitaForm.comentario" placeholder="Detalles adicionales de la visita..." :rows="4"></ion-textarea>
                </div>

                <div class="form-actions">
                  <ion-button expand="block" color="primary" @click="guardarVisita" :disabled="!esFormValido">
                    <ion-icon :icon="checkmarkOutline" slot="start"></ion-icon>
                    {{ editandoVisita ? 'Actualizar' : 'Agregar' }} Visita
                  </ion-button>
                </div>
              </ion-content>
            </ion-modal>
          </main>
        </ion-content>
      </div>
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  IonPage, IonContent, IonButton, IonIcon, IonBadge, 
  IonList, IonItem, IonLabel, IonCheckbox, IonSearchbar,
  IonSpinner, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonInput, IonTextarea, IonSelect, IonSelectOption,
  toastController
} from '@ionic/vue';
import { 
  sparkles, downloadOutline, checkmarkCircle, 
  newspaperOutline, documentTextOutline, imageOutline,
  heartOutline, cashOutline, cardOutline, giftOutline,
  mailOutline, callOutline, locationOutline,
  settingsOutline, checkmark, trashOutline,
  addOutline, checkmarkOutline, createOutline
} from 'ionicons/icons';
import html2pdf from 'html2pdf.js';
import Sidebar from '@/components/Layout/Sidebar.vue';
import Header from '@/components/Layout/Header.vue';
import { llmService, type VisitaData, type NoticiaGenerada } from '@/services/llmService';

// Estado
const visitas = ref<VisitaData[]>([]);
const visitasSeleccionadas = ref<number[]>([]);
const noticiasMap = ref<Map<number, NoticiaGenerada>>(new Map());
const generando = ref(false);
const busqueda = ref('');
const mostrarError = ref(false);
const mensajeError = ref('');
const proveedorUsado = ref<string>('');
const modeloUsado = ref<string>('');
const portadaColorFondo = ref<string>('#f5f5f0');
const portadaImagen = ref<string>('');
const mostrarConfiguracion = ref(false);
const mostrarModalVisita = ref(false);
const editandoVisita = ref(false);

const visitaForm = ref({
  id: 0,
  fecha: '',
  horaInicio: '',
  horaFin: '',
  actividad: '',
  tipo: 'Voluntariado',
  estado: 'Completada',
  pais: 'Guatemala',
  comentario: ''
});

const esFormValido = computed(() => {
  return visitaForm.value.fecha && 
         visitaForm.value.horaInicio && 
         visitaForm.value.horaFin && 
         visitaForm.value.actividad && 
         visitaForm.value.tipo && 
         visitaForm.value.estado && 
         visitaForm.value.pais;
});

const coloresPortada = [
  { value: '#f5f5f0', name: 'Beige Claro' },
  { value: '#ffffff', name: 'Blanco' },
  { value: '#1a1a1a', name: 'Negro' },
  { value: '#2c3e50', name: 'Azul Oscuro' },
  { value: '#34495e', name: 'Gris Azulado' },
  { value: '#5d4e37', name: 'Café' },
  { value: '#667eea', name: 'Azul Violeta' },
  { value: '#764ba2', name: 'Púrpura' },
  { value: '#11998e', name: 'Verde Azulado' },
  { value: '#eb3349', name: 'Rojo' },
  { value: '#f093fb', name: 'Rosa' },
  { value: '#4facfe', name: 'Azul Cielo' },
];

// Fecha actual formateada
const fechaActual = computed(() => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date().toLocaleDateString('es-ES', options);
});

// Fecha en formato MES AÑO para portada
const fechaMesAnio = computed(() => {
  const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 
                 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
  const fecha = new Date();
  return `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
});

// Visitas filtradas por búsqueda
const visitasFiltradas = computed(() => {
  if (!busqueda.value) return visitas.value;
  const query = busqueda.value.toLowerCase();
  return visitas.value.filter(v => 
    v.actividad.toLowerCase().includes(query) ||
    v.pais.toLowerCase().includes(query) ||
    v.tipo.toLowerCase().includes(query)
  );
});

// Noticias generadas para el PDF
const noticiasGeneradas = computed(() => {
  return Array.from(noticiasMap.value.values());
});

// Cargar visitas (simulado - conecta con tu API real)
const cargarVisitas = async () => {
  try {
    // Aquí deberías llamar a tu API de visitas
    // Por ahora uso datos de ejemplo:
    visitas.value = [
      {
        id: 1,
        fecha: '2024-01-15',
        horaInicio: '09:00',
        horaFin: '12:00',
        actividad: 'Visita al centro de acopio de alimentos',
        tipo: 'Voluntariado',
        estado: 'Completada',
        pais: 'Guatemala',
        comentario: 'Se recolectaron 500kg de alimentos. Gran participación de voluntarios.'
      },
      {
        id: 2,
        fecha: '2024-01-20',
        horaInicio: '14:00',
        horaFin: '17:00',
        actividad: 'Taller de capacitación para jóvenes',
        tipo: 'Educación',
        estado: 'Completada',
        pais: 'Guatemala',
        comentario: '30 jóvenes participaron activamente en el taller de liderazgo.'
      },
      {
        id: 3,
        fecha: '2024-02-05',
        horaInicio: '10:00',
        horaFin: '13:00',
        actividad: 'Jornada de limpieza en el río',
        tipo: 'Medio Ambiente',
        estado: 'Completada',
        pais: 'Guatemala',
        comentario: 'Se recolectaron 200kg de basura. Participaron 25 voluntarios.'
      }
    ];
  } catch (error) {
    console.error('Error cargando visitas:', error);
    mostrarToast('Error al cargar visitas', 'danger');
  }
};

// Seleccionar/deseleccionar visita
const toggleSeleccion = (visita: any) => {
  const index = visitasSeleccionadas.value.indexOf(visita.id);
  if (index === -1) {
    visitasSeleccionadas.value.push(visita.id);
  } else {
    visitasSeleccionadas.value.splice(index, 1);
    // Remover noticia generada si se deselecciona
    noticiasMap.value.delete(visita.id);
  }
};

// Generar noticias con IA
const generarNoticiasIA = async () => {
  if (visitasSeleccionadas.value.length === 0) return;
  
  generando.value = true;
  noticiasMap.value.clear();
  proveedorUsado.value = '';
  modeloUsado.value = '';
  
  try {
    // Generar noticias secuencialmente para no saturar el API
    for (const visitaId of visitasSeleccionadas.value) {
      const visita = visitas.value.find(v => v.id === visitaId);
      if (!visita) continue;
      
      const resultado = await llmService.generarContenidoVisita(visita);
      
      if (resultado.success) {
        noticiasMap.value.set(visitaId, resultado.data);
        // Guardar info del proveedor del último resultado
        proveedorUsado.value = resultado.provider || 'desconocido';
        modeloUsado.value = resultado.modelo || '';
      }
    }
    
    const providerMsg = proveedorUsado.value ? ` (via ${proveedorUsado.value})` : '';
    mostrarToast(`${noticiasMap.value.size} noticias generadas exitosamente${providerMsg}`, 'success');
  } catch (error: any) {
    console.error('Error generando noticias:', error);
    mensajeError.value = error.message || 'Error al generar noticias';
    mostrarError.value = true;
    mostrarToast('Error al generar noticias', 'danger');
  } finally {
    generando.value = false;
  }
};

// Descargar PDF
const descargarPDF = async () => {
  if (noticiasGeneradas.value.length === 0) return;
  
  const element = document.getElementById('pdf-content');
  if (!element) return;
  
  const opt = {
    margin: [15, 15, 15, 15] as [number, number, number, number],
    filename: `Boletin_Noticias_${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };
  
  try {
    await html2pdf().set(opt as any).from(element).save();
    mostrarToast('PDF descargado exitosamente', 'success');
  } catch (error) {
    console.error('Error descargando PDF:', error);
    mostrarToast('Error al descargar PDF', 'danger');
  }
};

// Formatear contenido en párrafos
const formatearParrafos = (contenido: string): string[] => {
  return contenido.split('\n').filter(p => p.trim() !== '');
};

// Color según estado
const getEstadoColor = (estado: string): string => {
  const colores: Record<string, string> = {
    'Completada': 'success',
    'Pendiente': 'warning',
    'Cancelada': 'danger',
    'En progreso': 'primary'
  };
  return colores[estado] || 'medium';
};

// Mostrar toast
const mostrarToast = async (mensaje: string, color: string) => {
  const toast = await toastController.create({
    message: mensaje,
    duration: 3000,
    color: color,
    position: 'bottom'
  });
  await toast.present();
};

// Cerrar modal de error
const cerrarError = () => {
  mostrarError.value = false;
  mensajeError.value = '';
};

// Configuración de portada
const abrirConfiguracion = () => {
  mostrarConfiguracion.value = true;
};

const cerrarConfiguracion = () => {
  mostrarConfiguracion.value = false;
};

const seleccionarColor = (color: string) => {
  portadaColorFondo.value = color;
  portadaImagen.value = '';
};

const obtenerNombreColor = (color: string): string => {
  const found = coloresPortada.find(c => c.value === color);
  return found ? found.name : color;
};

const subirImagen = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      portadaImagen.value = e.target?.result as string;
    };
    reader.readAsDataURL(input.files[0]);
  }
};

const eliminarImagen = () => {
  portadaImagen.value = '';
};

// Modal de Visita
const abrirModalAgregar = () => {
  editandoVisita.value = false;
  visitaForm.value = {
    id: Date.now(),
    fecha: new Date().toISOString().split('T')[0],
    horaInicio: '09:00',
    horaFin: '12:00',
    actividad: '',
    tipo: 'Voluntariado',
    estado: 'Completada',
    pais: 'Guatemala',
    comentario: ''
  };
  mostrarModalVisita.value = true;
};

const editarVisita = (visita: any) => {
  editandoVisita.value = true;
  visitaForm.value = {
    id: visita.id,
    fecha: visita.fecha,
    horaInicio: visita.horaInicio,
    horaFin: visita.horaFin,
    actividad: visita.actividad,
    tipo: visita.tipo,
    estado: visita.estado,
    pais: visita.pais,
    comentario: visita.comentario || ''
  };
  mostrarModalVisita.value = true;
};

const cerrarModalVisita = () => {
  mostrarModalVisita.value = false;
};

const guardarVisita = () => {
  if (!esFormValido.value) {
    mostrarToast('Por favor completa todos los campos requeridos', 'warning');
    return;
  }

  const nuevaVisita: VisitaData = {
    id: visitaForm.value.id,
    fecha: visitaForm.value.fecha,
    horaInicio: visitaForm.value.horaInicio,
    horaFin: visitaForm.value.horaFin,
    actividad: visitaForm.value.actividad,
    tipo: visitaForm.value.tipo,
    estado: visitaForm.value.estado,
    pais: visitaForm.value.pais,
    comentario: visitaForm.value.comentario
  };

  if (editandoVisita.value) {
    const index = visitas.value.findIndex(v => v.id === visitaForm.value.id);
    if (index !== -1) {
      visitas.value[index] = nuevaVisita;
    }
    mostrarToast('Visita actualizada', 'success');
  } else {
    visitas.value.push(nuevaVisita);
    mostrarToast('Visita agregada', 'success');
  }

  cerrarModalVisita();
};

// Cargar datos al montar
onMounted(() => {
  cargarVisitas();
});
</script>

<style scoped>
.dashboard-wrapper {
  display: flex;
  height: 100vh;
  background: #f5f7fa;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-padding {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.page-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
}

.actions-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 24px;
  height: calc(100vh - 200px);
}

/* Panel Izquierdo */
.filter-panel {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.filter-panel-header {
  padding: 20px;
  border-bottom: 1px solid #e8ecf1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-panel-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
}

.filter-panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.search-bar {
  --background: #f5f7fa;
  --border-radius: 12px;
  margin-bottom: 16px;
}

.visitas-list {
  background: transparent;
}

.visitas-list ion-item {
  --background: transparent;
  --border-color: #e8ecf1;
  --padding-start: 0;
  --inner-padding-end: 0;
  border-radius: 12px;
  margin-bottom: 8px;
}

.visitas-list ion-item.seleccionada {
  --background: #e8f4fd;
  --border-color: #3b82f6;
}

.visitas-list ion-item h3 {
  font-weight: 600;
  font-size: 15px;
  color: #1a1a2e;
  margin: 0 0 4px 0;
}

.visitas-list ion-item p {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.estado-badge {
  margin-top: 8px;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

/* Panel Derecho */
.preview-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e8ecf1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
}

.header-badges {
  display: flex;
  gap: 8px;
  align-items: center;
}

.provider-badge {
  font-size: 11px;
  padding: 4px 10px;
}

.pdf-preview-container {
  flex: 1;
  overflow: auto;
  padding: 24px;
  background: #f5f7fa;
}

.pdf-content {
  background: white;
  max-width: 210mm;
  margin: 0 auto;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-height: 297mm;
}

/* Estilos del PDF - Nueva estructura */

/* 1. PORTADA - Estilo Minimalista */
.portada-section {
  min-height: 280mm;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f0;
  margin: -40px -40px 40px -40px;
  padding: 60px 40px;
  page-break-after: always;
}

.portada-content {
  text-align: center;
  color: #1a1a1a;
  width: 100%;
  max-width: 400px;
}

.portada-content-oscuro {
  color: white;
}

.portada-content-oscuro .portada-titulo-principal,
.portada-content-oscuro .portada-titulo-secundario,
.portada-content-oscuro .portada-fecha,
.portada-content-oscuro .portada-nombre {
  color: white;
}

.portada-content-oscuro .portada-divider {
  background: white;
}

.portada-content-oscuro .ondas-svg path {
  stroke: white;
}

.portada-header {
  margin-bottom: 20px;
}

.portada-titulo-principal {
  font-size: 52px;
  font-weight: 400;
  margin: 0;
  letter-spacing: 12px;
  text-transform: uppercase;
  font-family: 'Georgia', 'Times New Roman', serif;
  color: #1a1a1a;
  line-height: 1.1;
}

.portada-titulo-secundario {
  font-size: 52px;
  font-weight: 400;
  margin: 0 0 20px 0;
  letter-spacing: 8px;
  text-transform: uppercase;
  font-family: 'Georgia', 'Times New Roman', serif;
  color: #1a1a1a;
  line-height: 1.1;
}

.portada-fecha {
  font-size: 14px;
  font-weight: 400;
  margin: 0;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #1a1a1a;
}

.portada-ondas {
  margin: 30px 0;
  display: flex;
  justify-content: center;
}

.ondas-svg {
  width: 180px;
  height: 40px;
}

.portada-subtitulo {
  margin-top: 40px;
}

.portada-nombre {
  font-size: 42px;
  font-weight: 600;
  margin: 0;
  color: #1a1a1a;
  font-family: 'Georgia', 'Times New Roman', serif;
  letter-spacing: 2px;
}

.portada-divider {
  width: 60px;
  height: 2px;
  background: #1a1a1a;
  margin: 40px auto 0;
}

/* Secciones comunes */
.seccion-noticias,
.seccion-imagenes,
.seccion-agradecimientos,
.seccion-oracion,
.seccion-contacto {
  margin-bottom: 50px;
  page-break-inside: avoid;
}

.seccion-header {
  margin-bottom: 25px;
  text-align: center;
}

.seccion-titulo {
  font-size: 24px;
  font-weight: 400;
  color: #1a1a1a;
  margin: 0 0 15px 0;
  text-transform: uppercase;
  letter-spacing: 4px;
  font-family: 'Georgia', 'Times New Roman', serif;
}

.seccion-linea {
  width: 60px;
  height: 1px;
  background: #1a1a1a;
  margin: 0 auto;
}

/* 2. NOTICIAS - Estilo Minimalista */
.noticia-item {
  margin-bottom: 40px;
  padding: 30px 0;
  border-bottom: 1px solid #e5e5e5;
}

.noticia-item:last-child {
  border-bottom: none;
}

.noticia-header {
  margin-bottom: 20px;
}

.noticia-categoria {
  display: inline-block;
  color: #1a1a1a;
  font-size: 11px;
  font-weight: 400;
  padding: 4px 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 12px;
  border-bottom: 1px solid #1a1a1a;
}

.noticia-titulo {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  line-height: 1.3;
  font-family: 'Georgia', 'Times New Roman', serif;
}

.noticia-resumen {
  font-size: 14px;
  font-style: italic;
  color: #666;
  margin: 0 0 15px 0;
  line-height: 1.5;
}

.noticia-contenido {
  font-size: 14px;
  line-height: 1.9;
  color: #333;
  text-align: justify;
  font-family: 'Georgia', 'Times New Roman', serif;
}

.noticia-contenido p {
  margin: 0 0 14px 0;
}

.noticia-contenido p:last-child {
  margin-bottom: 0;
}

.noticia-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, #e8ecf1, transparent);
  margin: 35px 0;
}

/* 3. COLLAGE DE IMÁGENES */
.collage-container {
  padding: 20px 0;
}

.collage-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.collage-item {
  aspect-ratio: 4/3;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.collage-item-1 {
  grid-column: span 2;
  aspect-ratio: 16/9;
}

.imagen-placeholder {
  width: 100%;
  height: 100%;
  background: #f5f5f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
}

.imagen-icono {
  font-size: 40px;
  margin-bottom: 10px;
}

/* 4. AGRADECIMIENTOS - Estilo Minimalista */
.agradecimientos-content {
  background: transparent;
  padding: 20px 0;
  text-align: center;
}

.agradecimiento-texto {
  font-size: 15px;
  line-height: 1.9;
  color: #333;
  margin: 0 0 20px 0;
  font-family: 'Georgia', 'Times New Roman', serif;
  text-align: justify;
}

.agradecimiento-texto:last-child {
  margin-bottom: 0;
  font-style: italic;
}

/* 5. PUNTOS DE ORACIÓN - Estilo Minimalista */
.oracion-content {
  background: transparent;
  padding: 20px 0;
}

.oracion-lista {
  list-style: none;
  padding: 0;
  margin: 0;
}

.oracion-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #e5e5e5;
  font-size: 14px;
  color: #333;
  font-family: 'Georgia', 'Times New Roman', serif;
  line-height: 1.6;
}

.oracion-item:last-child {
  border-bottom: none;
}

.oracion-icono {
  font-size: 14px;
  color: #1a1a1a;
  flex-shrink: 0;
  margin-top: 3px;
}

/* 6. OFRENDAS Y CONTACTO - Estilo Minimalista */
.contacto-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.ofrendas-section,
.contacto-info {
  padding: 20px 0;
  background: transparent;
  border: none;
}

.contacto-subtitulo {
  font-size: 16px;
  font-weight: 400;
  color: #1a1a1a;
  margin: 0 0 15px 0;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: 'Georgia', 'Times New Roman', serif;
}

.contacto-texto {
  font-size: 14px;
  line-height: 1.7;
  color: #555;
  margin: 0 0 20px 0;
  text-align: left;
  font-family: 'Georgia', 'Times New Roman', serif;
}

.ofrenda-info,
.contacto-detalles {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ofrenda-item,
.contacto-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  background: transparent;
  border-bottom: 1px solid #e5e5e5;
  font-size: 14px;
  color: #333;
}

.ofrenda-item:last-child,
.contacto-item:last-child {
  border-bottom: none;
}

.ofrenda-icono,
.contacto-icono {
  font-size: 16px;
  color: #1a1a1a;
  flex-shrink: 0;
}

/* Pie de página - Estilo Minimalista */
.boletin-footer {
  margin-top: 50px;
  padding-top: 30px;
  text-align: center;
  background: #1a1a1a;
  margin: 50px -40px -40px -40px;
  padding: 40px;
  color: #f5f5f0;
}

.footer-divider {
  width: 60px;
  height: 1px;
  background: #f5f5f0;
  margin: 0 auto 25px;
}

.footer-mensaje {
  font-size: 16px;
  font-weight: 400;
  margin: 0 0 10px 0;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: 'Georgia', 'Times New Roman', serif;
}

.footer-fecha {
  font-size: 12px;
  margin: 0 0 8px 0;
  opacity: 0.8;
  letter-spacing: 2px;
}

.footer-web {
  font-size: 12px;
  margin: 0;
  opacity: 0.6;
  letter-spacing: 1px;
}

/* Loading */
.loading-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  color: #3b82f6;
}

.loading-text {
  margin-top: 24px;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
}

.loading-subtext {
  margin-top: 8px;
  font-size: 14px;
  color: #6b7280;
}

/* Empty Preview */
.empty-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  text-align: center;
  color: #9ca3af;
}

.empty-preview-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.empty-preview h3 {
  font-size: 20px;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.empty-preview p {
  font-size: 14px;
  max-width: 300px;
}

/* Responsive PDF */
@media (max-width: 768px) {
  .pdf-content {
    padding: 20px;
  }
  
  .portada-section {
    margin: -20px -20px 30px -20px;
    padding: 40px 20px;
    min-height: auto;
  }
  
  .organizacion-nombre {
    font-size: 36px;
  }
  
  .boletin-titulo-principal {
    font-size: 28px;
  }
  
  .contacto-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .collage-grid {
    grid-template-columns: 1fr;
  }
  
  .collage-item-1 {
    grid-column: span 1;
  }
  
  .seccion-titulo {
    font-size: 22px;
  }
  
  .noticia-titulo {
    font-size: 20px;
  }
}

/* Estilos para impresión */
@media print {
  .pdf-content {
    box-shadow: none;
    padding: 0;
    max-width: 100%;
  }
  
  .portada-section {
    page-break-after: always;
    min-height: 100vh;
    margin: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .seccion-noticias,
  .seccion-imagenes,
  .seccion-agradecimientos,
  .seccion-oracion,
  .seccion-contacto {
    page-break-inside: avoid;
  }
  
  .boletin-footer {
    margin: 0;
    page-break-inside: avoid;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

/* Responsive dashboard */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
  
  .filter-panel {
    max-height: 300px;
  }
}

/* Configuración de Portada */
.config-section {
  margin-bottom: 24px;
}

.config-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #1a1a2e;
}

.color-options {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
}

.color-option {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.color-option:hover {
  transform: scale(1.05);
}

.color-option.selected {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.color-check {
  color: white;
  font-size: 18px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}

.color-name {
  font-size: 14px;
  color: #6b7280;
  margin: 10px 0 0 0;
  text-align: center;
}

.file-input {
  width: 100%;
  padding: 10px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  margin-bottom: 10px;
}

.imagen-preview {
  margin-top: 15px;
}

.imagen-preview img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 10px;
}

.preview-mini {
  margin-top: 10px;
}

.preview-portada-mini {
  height: 120px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
}

.preview-mini-content {
  text-align: center;
  color: #1a1a1a;
}

.preview-mini-content.oscuro {
  color: white;
}

.preview-mini-titulo {
  display: block;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.preview-mini-nombre {
  display: block;
  font-size: 18px;
  font-weight: 600;
  margin-top: 8px;
  font-family: 'Georgia', serif;
}

/* Estilos del Modal de Visita */
.modal-visita {
  --height: 90%;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.form-group ion-input,
.form-group ion-textarea,
.form-group ion-select {
  --background: #f5f7fa;
  --border-radius: 8px;
  --padding-start: 12px;
  --padding-end: 12px;
  border: 1px solid #e5e7eb;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-actions {
  margin-top: 24px;
}

/* Header del panel de visitas */
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e8ecf1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.visitas-list ion-item {
  --padding-end: 8px;
}
</style>
