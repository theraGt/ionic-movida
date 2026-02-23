<template>
  <ion-page>
    <div class="dashboard-wrapper">
      <Sidebar />

      <div class="main-container">
        <Header />

        <ion-content>
          <main class="content-padding">
            <div class="page-title-row">
              <h1 class="page-title">Mapa de Ubicaciones</h1>
              <div class="actions-group">
                <ion-button fill="clear" color="medium" @click="resetView">
                  <ion-icon slot="icon-only" :icon="locateOutline"></ion-icon>
                </ion-button>
                <ion-button fill="clear" color="medium" @click="toggleFilter">
                  <ion-icon slot="icon-only" :icon="funnelOutline"></ion-icon>
                  <ion-badge v-if="activeFiltersCount > 0" color="danger" class="filter-badge">{{ activeFiltersCount
                    }}</ion-badge>
                </ion-button>
              </div>
            </div>

            <div class="map-grid">
              <!-- Sección del Mapa -->
              <section class="map-section">
                <div class="card-container map-card">
                  <header class="card-header">
                    <h2 class="card-title">
                      <ion-icon :icon="mapOutline" class="card-icon"></ion-icon>
                      Mapa
                    </h2>
                    <div class="map-stats">
                      <span class="stat-item">
                        <span class="stat-value">{{ filteredLocations.length }}</span>
                        <span class="stat-label">ubicaciones</span>
                      </span>
                    </div>
                  </header>
                  <div class="map-wrapper">
                    <MapView :locations="filteredLocations" :center="mapCenter" :zoom="mapZoom"
                      @select-location="handleSelectLocation" />
                  </div>
                </div>
              </section>

              <!-- Sección de Lista -->
              <section class="list-section">
                <div class="card-container">
                  <header class="card-header">
                    <h2 class="card-title">
                      <ion-icon :icon="listOutline" class="card-icon"></ion-icon>
                      Ubicaciones
                    </h2>
                    <ion-button size="small" @click="handleAdd" class="add-button">
                      <ion-icon slot="start" :icon="addOutline"></ion-icon>
                      Agregar
                    </ion-button>
                  </header>

                  <!-- Filtros activos -->
                  <div v-if="activeFiltersCount > 0" class="active-filters">
                    <div class="filter-chips">
                      <ion-chip v-for="(filter, index) in activeFilterChips" :key="index" color="warning">
                        <ion-label>{{ filter }}</ion-label>
                        <ion-icon :icon="closeCircleOutline" @click="removeFilter(index)"></ion-icon>
                      </ion-chip>
                      <ion-button fill="clear" size="small" @click="clearFilters">
                        Limpiar
                      </ion-button>
                    </div>
                  </div>

                  <!-- Lista de ubicaciones -->
                  <div class="locations-list">
                    <div v-for="location in filteredLocations" :key="location.id" class="location-item"
                      :class="{ 'is-selected': selectedLocation?.id === location.id }"
                      @click="handleSelectLocation(location)">
                      <div class="location-marker" :class="`marker-${location.tipo}`"></div>
                      <div class="location-info">
                        <h4 class="location-name">{{ location.nombre }}</h4>
                        <p class="location-meta">
                          <span class="location-type">{{ getTipoLabel(location.tipo) }}</span>
                          <span v-if="location.pais" class="location-pais">• {{ location.pais }}</span>
                        </p>
                        <p class="location-coords">
                          {{ location.latitud.toFixed(4) }}, {{ location.longitud.toFixed(4) }}
                        </p>
                      </div>
                      <ion-icon :icon="chevronForwardOutline" class="location-arrow"></ion-icon>
                    </div>

                    <div v-if="filteredLocations.length === 0" class="empty-state">
                      <ion-icon :icon="locationOutline" class="empty-icon"></ion-icon>
                      <p>No hay ubicaciones para mostrar</p>
                      <ion-button fill="clear" @click="handleAdd">
                        Agregar ubicación
                      </ion-button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </ion-content>
      </div>

      <!-- Panel de Detalles -->
      <MapDetailPanel :is-open="isDetailPanelOpen && !selectedVisita" :location="selectedLocation" @close="isDetailPanelOpen = false"
        @edit="handleEdit" @delete="handleDelete" />

      <!-- Panel de Detalles de Visita -->
      <VisitaDetailPanel
        :is-open="isVisitaPanelOpen"
        :visita="selectedVisita"
        @close="closeVisitaPanel"
        @edit="handleVisitaEdit"
        @delete="handleVisitaDelete"
      />

      <!-- Modal de Filtros -->
      <ion-modal :is-open="isFilterModalOpen" @didDismiss="isFilterModalOpen = false" class="filter-modal">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="isFilterModalOpen = false">
                <ion-icon :icon="chevronBackOutline"></ion-icon>
              </ion-button>
            </ion-buttons>
            <ion-title>Filtrar Ubicaciones</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div class="filter-section">
            <div class="filter-header">
              <span class="filter-label">TIPO</span>
            </div>
            <div class="filter-options">
              <ion-item v-for="tipo in tipoOptions" :key="tipo" lines="none">
                <ion-checkbox slot="start" :checked="filters.tipo.includes(tipo)"
                  @ionChange="toggleFilterType('tipo', tipo)"></ion-checkbox>
                <ion-label>{{ getTipoLabel(tipo) }}</ion-label>
              </ion-item>
            </div>
          </div>

          <div class="filter-section">
            <div class="filter-header">
              <span class="filter-label">PAÍS</span>
            </div>
            <div class="filter-options">
              <ion-item v-for="pais in paisOptions" :key="pais" lines="none">
                <ion-checkbox slot="start" :checked="filters.pais.includes(pais)"
                  @ionChange="toggleFilterType('pais', pais)"></ion-checkbox>
                <ion-label>{{ pais }}</ion-label>
              </ion-item>
            </div>
          </div>
        </ion-content>

        <ion-footer class="filter-footer">
          <ion-button fill="clear" color="medium" @click="clearFilters">
            Limpiar
          </ion-button>
          <ion-button fill="clear" color="warning" @click="isFilterModalOpen = false">
            Aplicar
          </ion-button>
        </ion-footer>
      </ion-modal>
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  IonPage, IonContent, IonButton, IonIcon, IonBadge,
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonItem, IonLabel, IonCheckbox, IonChip, toastController
} from '@ionic/vue';
import {
  addOutline,
  funnelOutline,
  locateOutline,
  chevronBackOutline,
  chevronForwardOutline,
  closeCircleOutline,
  mapOutline,
  listOutline,
  locationOutline
} from 'ionicons/icons';

// Layout & Componentes
import Sidebar from '@/components/Layout/Sidebar.vue';
import Header from '@/components/Layout/Header.vue';
import MapView from '@/components/map/MapView.vue';
import MapDetailPanel from '@/components/map/MapDetailPanel.vue';
import VisitaDetailPanel from '@/components/visitas/VisitaDetailPanel.vue';

// Tipos
import { MapLocation } from '@/types/map';
import { Visita } from '@/types/visita';

// Datos de ejemplo (reemplazar con datos reales de tu API)
const locations = ref<MapLocation[]>([
  {
    id: '1',
    nombre: 'Sede Central Movida',
    tipo: 'actividad',
    latitud: 14.6349,
    longitud: -90.5069,
    descripcion: 'Oficina principal de Movida GT',
    pais: 'Guatemala',
    encargado: 'Juan Pérez',
    fecha: '2024-01-15',
    estado: 'Activo',
    direccion: 'Zona 1, Ciudad de Guatemala'
  },
  {
    id: '2',
    nombre: 'Iglesia El Calvario',
    tipo: 'visita',
    latitud: 14.6061,
    longitud: -90.5225,
    descripcion: 'Visita pastoral a la iglesia',
    pais: 'Guatemala',
    encargado: 'María García',
    fecha: '2024-02-20',
    estado: 'Completado',
    direccion: 'Zona 3, Ciudad de Guatemala'
  },
  {
    id: '3',
    nombre: 'Comunidad San Juan',
    tipo: 'mision',
    latitud: 14.6760,
    longitud: -90.4890,
    descripcion: 'Misión comunitaria',
    pais: 'Guatemala',
    encargado: 'Pedro López',
    fecha: '2024-03-10',
    estado: 'Pendiente',
    direccion: 'Zona 18, Ciudad de Guatemala'
  },
  {
    id: '4',
    nombre: 'Centro de Voluntarios',
    tipo: 'voluntario',
    latitud: 14.5950,
    longitud: -90.5150,
    descripcion: 'Punto de encuentro de voluntarios',
    pais: 'Guatemala',
    encargado: 'Ana Martínez',
    fecha: '2024-01-20',
    estado: 'Activo',
    direccion: 'Zona 10, Ciudad de Guatemala'
  }
]);

// Filtros
const filters = ref({
  tipo: [] as string[],
  pais: [] as string[]
});

const tipoOptions = ['actividad', 'visita', 'voluntario', 'mision'];
const paisOptions = ['Guatemala', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panamá'];

// Estados
const isDetailPanelOpen = ref(false);
const isFilterModalOpen = ref(false);
const isVisitaPanelOpen = ref(false);
const selectedLocation = ref<MapLocation | null>(null);
const selectedVisita = ref<Visita | null>(null);
const mapCenter = ref<[number, number]>([-90.5069, 14.6349]);
const mapZoom = ref(12);
const visitas = ref<Visita[]>([]);
const API_URL = 'https://thera-ia-api-movida-app.9zx1zd.easypanel.host';

// Convertir visitas a MapLocation
const visitasAsLocations = computed((): MapLocation[] => {
  return visitas.value
    .filter(v => v.coordenada && v.coordenada.includes(','))
    .map(v => {
      const [lat, lng] = v.coordenada.split(',').map(c => parseFloat(c.trim()));
      return {
        id: `visita-${v.id}`,
        nombre: v.descripcion || 'Visita sin nombre',
        tipo: 'visita' as const,
        latitud: lat,
        longitud: lng,
        descripcion: v.descripcion,
        pais: v.pais,
        encargado: v.encargado,
        fecha: v.inicio?.split('T')[0],
        estado: 'Completado',
        direccion: v.coordenada,
        visitaData: v
      };
    })
    .filter(v => !isNaN(v.latitud) && !isNaN(v.longitud));
});

// Computed
const filteredLocations = computed(() => {
  let result = [...locations.value, ...visitasAsLocations.value];

  if (filters.value.tipo.length > 0) {
    result = result.filter(l => filters.value.tipo.includes(l.tipo));
  }

  if (filters.value.pais.length > 0) {
    result = result.filter(l => filters.value.pais.includes(l.pais || ''));
  }

  return result;
});

const activeFiltersCount = computed(() => {
  return filters.value.tipo.length + filters.value.pais.length;
});

const activeFilterChips = computed(() => {
  const chips: string[] = [];
  filters.value.tipo.forEach(t => chips.push(getTipoLabel(t)));
  filters.value.pais.forEach(p => chips.push(p));
  return chips;
});

// Métodos
const getTipoLabel = (tipo: string) => {
  const labels: Record<string, string> = {
    'actividad': 'Actividad',
    'visita': 'Visita',
    'voluntario': 'Voluntario',
    'mision': 'Misión'
  };
  return labels[tipo] || tipo;
};

const handleSelectLocation = (location: MapLocation) => {
  selectedLocation.value = location;
  
  // Si es una visita, abrir el panel de visitas
  if (location.visitaData) {
    selectedVisita.value = location.visitaData;
    isVisitaPanelOpen.value = true;
  } else {
    // Si es una ubicación normal, abrir el panel de mapa
    selectedVisita.value = null;
    isDetailPanelOpen.value = true;
  }

  // Centrar el mapa en la ubicación seleccionada
  mapCenter.value = [location.longitud, location.latitud];
  mapZoom.value = 15;
};

const handleAdd = () => {
  // Implementar lógica para agregar nueva ubicación
  console.log('Agregar nueva ubicación');
};

const handleEdit = (location: MapLocation | null) => {
  if (location) {
    console.log('Editar ubicación:', location);
    isDetailPanelOpen.value = false;
  }
};

const handleDelete = async (id: string | undefined) => {
  if (id) {
    try {
      locations.value = locations.value.filter(l => l.id !== id);
      const toast = await toastController.create({
        message: 'Ubicación eliminada',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
      isDetailPanelOpen.value = false;
    } catch (error) {
      console.error('Error:', error);
    }
  }
};

const toggleFilter = () => {
  isFilterModalOpen.value = true;
};

const toggleFilterType = (filterType: 'tipo' | 'pais', value: string) => {
  const index = filters.value[filterType].indexOf(value);
  if (index > -1) {
    filters.value[filterType].splice(index, 1);
  } else {
    filters.value[filterType].push(value);
  }
};

const clearFilters = () => {
  filters.value = {
    tipo: [],
    pais: []
  };
};

const removeFilter = (index: number) => {
  if (index < filters.value.tipo.length) {
    filters.value.tipo.splice(index, 1);
  } else {
    const paisIndex = index - filters.value.tipo.length;
    filters.value.pais.splice(paisIndex, 1);
  }
};

const resetView = () => {
  mapCenter.value = [-90.5069, 14.6349];
  mapZoom.value = 12;
};

// Métodos para el panel de visitas
const closeVisitaPanel = () => {
  isVisitaPanelOpen.value = false;
  selectedVisita.value = null;
};

const handleVisitaEdit = () => {
  // Redirigir a la vista de visitas para editar
  isVisitaPanelOpen.value = false;
  // Opcional: emitir evento o navegar a visitas
};

const handleVisitaDelete = async () => {
  // Recargar las visitas después de eliminar
  await fetchVisitas();
  isVisitaPanelOpen.value = false;
  selectedVisita.value = null;
};

// Cargar visitas desde la API
const fetchVisitas = async () => {
  try {
    const response = await fetch(`${API_URL}/visitas`);
    if (!response.ok) throw new Error('Error fetching visitas');
    const data = await response.json();
    visitas.value = data as Visita[];
  } catch (error) {
    console.error('Error:', error);
    // Datos de ejemplo para pruebas
    visitas.value = [
      {
        id: '1f5dea15',
        idActividad: '0fa9fb23',
        inicio: '2024-01-02T20:00:00',
        coordenada: '14.588310, -90.530080',
        descripcion: 'Despedida de Samuel en el Aeropuerto',
        contacto: '50249989952',
        encargado: 'Samuel Barrios',
        foto: '',
        tipo: 'Prisma',
        pais: 'Guatemala',
        personasAlcanzadas: 1,
        contactosNuevos: 1,
        kmRecorridos: 0,
        tiempoInvertido: 36,
        gasolina: 0,
        comida: 0,
        otrosGastos: 0,
        totalInversion: 0,
      },
      {
        id: '2a8b9c34',
        idActividad: '1cd2ef45',
        inicio: '2024-01-15T10:30:00',
        coordenada: '14.634915, -90.506882',
        descripcion: 'Reunión de seguimiento con equipo de ventas en oficina central',
        contacto: '50241234567',
        encargado: 'María González',
        foto: '',
        tipo: 'Visita',
        pais: 'Guatemala',
        personasAlcanzadas: 5,
        contactosNuevos: 2,
        kmRecorridos: 12,
        tiempoInvertido: 2,
        gasolina: 150,
        comida: 200,
        otrosGastos: 50,
        totalInversion: 400,
      },
    ];
  }
};

onMounted(() => {
  // Cargar las visitas al montar el componente
  fetchVisitas();
});
</script>

<style scoped>
.dashboard-wrapper {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background-color: #f9fafb;
}

.content-padding {
  padding: 24px;
}

.page-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #111827;
}

.actions-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 0.7rem;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
}

.map-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  height: calc(100vh - 180px);
}

.map-section {
  min-height: 0;
}

.list-section {
  min-height: 0;
}

.card-container {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.map-card {
  padding: 0;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-icon {
  color: #E8913A;
  font-size: 20px;
}

.add-button {
  --background: #E8913A;
  --color: white;
  font-weight: 500;
  --border-radius: 8px;
}

.map-stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #E8913A;
}

.stat-label {
  font-size: 0.8rem;
  color: #6b7280;
}

.map-wrapper {
  flex: 1;
  min-height: 0;
  position: relative;
}

.active-filters {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.locations-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.location-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.location-item:hover {
  background: #f9fafb;
}

.location-item.is-selected {
  background: #fef3c7;
}

.location-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.marker-actividad {
  background: #3b82f6;
}

.marker-visita {
  background: #10b981;
}

.marker-voluntario {
  background: #f59e0b;
}

.marker-mision {
  background: #8b5cf6;
}

.location-info {
  flex: 1;
  min-width: 0;
}

.location-name {
  margin: 0 0 4px 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.location-meta {
  margin: 0 0 2px 0;
  font-size: 0.8rem;
  color: #6b7280;
}

.location-type {
  text-transform: capitalize;
}

.location-coords {
  margin: 0;
  font-size: 0.75rem;
  color: #9ca3af;
  font-family: monospace;
}

.location-arrow {
  color: #d1d5db;
  font-size: 18px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  color: #d1d5db;
  margin-bottom: 12px;
}

/* Modal de Filtros */
.filter-modal {
  --width: 100%;
  --height: 100%;
}

.filter-section {
  margin-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 16px;
}

.filter-section:last-child {
  border-bottom: none;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.filter-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-options {
  padding-left: 8px;
}

.filter-options ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
  --min-height: 40px;
}

.filter-options ion-checkbox {
  margin-right: 12px;
  --checkbox-background: #ffffff;
  --checkbox-background-checked: #E8913A;
  --border-color: #d1d5db;
  --border-color-checked: #E8913A;
  --checkmark-color: #ffffff;
}

.filter-options ion-label {
  font-size: 0.9rem;
  color: #4b5563;
  text-transform: capitalize;
}

.filter-footer {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background: #ffffff;
}

/* Scrollbar personalizado */
.locations-list::-webkit-scrollbar {
  width: 6px;
}

.locations-list::-webkit-scrollbar-track {
  background: transparent;
}

.locations-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.locations-list::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Responsive */
@media (min-width: 768px) {
  .filter-modal {
    --width: 400px;
    --height: 100%;
    --border-radius: 0;
  }
}

@media (max-width: 1024px) {
  .map-grid {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 300px;
  }

  .list-section {
    max-height: 300px;
  }
}

@media (max-width: 768px) {
  .content-padding {
    padding: 16px;
  }

  .dashboard-wrapper {
    flex-direction: column;
  }

  .map-grid {
    grid-template-columns: 1fr;
    grid-template-rows: 400px auto;
    height: auto;
  }
}

/* Dark Mode */
.dark .main-container {
  background-color: #111827;
}

.dark .page-title {
  color: #f3f4f6;
}

.dark .card-container {
  background: #1f2937;
  border-color: #374151;
}

.dark .card-header {
  border-bottom-color: #374151;
}

.dark .card-title {
  color: #f3f4f6;
}

.dark .stat-value {
  color: #f0a85a;
}

.dark .stat-label {
  color: #9ca3af;
}

.dark .active-filters {
  border-bottom-color: #374151;
}

.dark .location-item:hover {
  background: #374151;
}

.dark .location-item.is-selected {
  background: #451a03;
}

.dark .location-name {
  color: #f3f4f6;
}

.dark .location-meta {
  color: #9ca3af;
}

.dark .location-coords {
  color: #6b7280;
}

.dark .location-arrow {
  color: #4b5563;
}

.dark .empty-state {
  color: #9ca3af;
}

.dark .empty-icon {
  color: #4b5563;
}

.dark .filter-section {
  border-bottom-color: #374151;
}

.dark .filter-label {
  color: #d1d5db;
}

.dark .filter-options ion-label {
  color: #d1d5db;
}

.dark .filter-footer {
  border-top-color: #374151;
  background: #1f2937;
}

.dark .locations-list::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark .locations-list::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
