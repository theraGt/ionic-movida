<template>
  <ion-page>
    <div class="dashboard-wrapper">
      <Sidebar />

      <div class="main-container">
        <Header />

        <ion-content>
          <main class="content-padding">
            <div class="page-title-row">
              <h1 class="page-title">Visitas</h1>
              <div class="actions-group">
                <ion-button fill="clear" color="medium" @click="openFilterModal">
                  <ion-icon slot="icon-only" :icon="filterOutline"></ion-icon>
                  <ion-badge v-if="activeFiltersCount > 0" color="danger" class="filter-badge">{{ activeFiltersCount }}</ion-badge>
                </ion-button>
                <ion-button fill="clear" color="medium">
                  <ion-icon slot="icon-only" :icon="downloadOutline"></ion-icon>
                </ion-button>
              </div>
            </div>

            <div class="dashboard-grid">
              <aside class="filter-panel">
                <div class="filter-panel-header">
                  <h3>Filtrar por</h3>
                </div>
                <div class="filter-panel-content">
                  <div class="filter-section">
                    <label class="filter-label">Año</label>
                    <ion-select v-model="selectedYear" placeholder="Seleccionar año" interface="popover" class="filter-select" @ionChange="applyDateFilter">
                      <ion-select-option :value="null">Todos</ion-select-option>
                      <ion-select-option v-for="year in availableYears" :key="year" :value="year">{{ year }}</ion-select-option>
                    </ion-select>
                  </div>
                  <div class="filter-section">
                    <label class="filter-label">Mes</label>
                    <ion-select v-model="selectedMonth" placeholder="Seleccionar mes" interface="popover" class="filter-select" @ionChange="applyDateFilter">
                      <ion-select-option :value="null">Todos</ion-select-option>
                      <ion-select-option v-for="(month, index) in months" :key="index" :value="index + 1">{{ month }}</ion-select-option>
                    </ion-select>
                  </div>
                  <ion-button v-if="selectedYear || selectedMonth" expand="block" fill="outline" size="small" color="medium" @click="clearDateFilter" class="clear-btn">
                    Limpiar filtros
                  </ion-button>
                </div>
              </aside>

              <section class="visitas-section">
                <div class="card-container">
                  <header class="card-header">
                    <h2 class="card-title">Registro de Visitas</h2>
                    <div class="header-actions">
                      <ion-button size="small" @click="handleAdd" class="add-button">
                        <ion-icon slot="start" :icon="addOutline"></ion-icon>
                        Nueva Visita
                      </ion-button>
                    </div>
                  </header>

                  <VisitasTable
                    :visitas="filteredVisitas"
                    :loading="loading"
                    :selected-visita="selectedVisita"
                    :has-filters="activeFiltersCount > 0"
                    @select="handleSelect"
                    @edit="handleEdit"
                    @delete="fetchVisitas"
                  />
                </div>
              </section>
            </div>
          </main>
        </ion-content>
      </div>

      <VisitaDetailPanel
        :is-open="isPanelOpen"
        :visita="selectedVisita"
        @close="closePanel"
        @edit="handleEditFromPanel"
        @delete="handleDeleteFromPanel"
      />

      <VisitaModal
        :is-open="isModalOpen"
        :visita="selectedVisita"
        @close="closeModal"
        @save="handleSave"
      />

      <!-- Modal de Filtros con diseño de imagen -->
      <VisitasFilterModal
        :is-open="isFilterModalOpen"
        :visitas="visitas"
        @close="closeFilterModal"
        @filter="onFilterApplied"
      />
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { 
  IonPage, 
  IonContent, 
  IonButton, 
  IonIcon, 
  IonBadge,
  IonSelect,
  IonSelectOption
} from '@ionic/vue';
import { 
  addOutline, 
  filterOutline, 
  downloadOutline,
  closeCircle
} from 'ionicons/icons';

import Sidebar from '@/components/Layout/Sidebar.vue';
import Header from '@/components/Layout/Header.vue';
import VisitasTable from '@/components/visitas/VisitasTable.vue';
import VisitaDetailPanel from '@/components/visitas/VisitaDetailPanel.vue';
import VisitaModal from '@/components/visitas/VisitaModal.vue';
import VisitasFilterModal from '@/components/visitas/VisitasFilterModal.vue';
import { Visita } from '@/types/visita';

const visitas = ref<Visita[]>([]);
const filteredVisitas = ref<Visita[]>([]);
const loading = ref(true);
const isModalOpen = ref(false);
const isPanelOpen = ref(false);
const isFilterModalOpen = ref(false);
const selectedVisita = ref<Visita | null>(null);
const activeFiltersCount = ref(0);

const selectedYear = ref<number | null>(null);
const selectedMonth = ref<number | null>(null);
const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const availableYears = computed(() => {
  const years = new Set<number>();
  visitas.value.forEach(v => {
    if (v.inicio) {
      const date = new Date(v.inicio);
      if (!isNaN(date.getTime())) {
        years.add(date.getFullYear());
      }
    }
  });
  return Array.from(years).sort((a, b) => b - a);
});

const isDateFilterActive = computed(() => {
  return selectedYear.value !== null || selectedMonth.value !== null;
});

const sortByDateDesc = (data: Visita[]) => {
  return [...data].sort((a, b) => {
    const dateA = new Date(a.inicio || 0);
    const dateB = new Date(b.inicio || 0);
    return dateB.getTime() - dateA.getTime();
  });
};

const applyDateFilter = () => {
  let result = visitas.value;
  
  if (selectedYear.value !== null) {
    result = result.filter(v => {
      if (!v.inicio) return false;
      const date = new Date(v.inicio);
      return !isNaN(date.getTime()) && date.getFullYear() === selectedYear.value;
    });
  }
  
  if (selectedMonth.value !== null) {
    result = result.filter(v => {
      if (!v.inicio) return false;
      const date = new Date(v.inicio);
      return !isNaN(date.getTime()) && (date.getMonth() + 1) === selectedMonth.value;
    });
  }
  
  filteredVisitas.value = sortByDateDesc(result);
  updateFilterBadge();
};

const updateFilterBadge = () => {
  let count = 0;
  if (isDateFilterActive.value) count++;
  if (activeFiltersCount.value > 1) count++;
  activeFiltersCount.value = count;
};

const clearDateFilter = () => {
  selectedYear.value = null;
  selectedMonth.value = null;
  filteredVisitas.value = visitas.value;
  updateFilterBadge();
};

const API_URL = 'https://thera-ia-api-movida-app.9zx1zd.easypanel.host/';

const fetchVisitas = async () => {
  try {
    loading.value = true;
    const response = await fetch(`${API_URL}/visitas`);
    if (!response.ok) throw new Error('Error fetching visitas');
    const data = await response.json();
    visitas.value = sortByDateDesc(data as Visita[]);
    filteredVisitas.value = visitas.value;
  } catch (error) {
    console.error('Error:', error);
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
      {
        id: '3c7d4e56',
        idActividad: '2gh3ij67',
        inicio: '2024-01-20T14:00:00',
        coordenada: '13.692940, -89.218191',
        descripcion: 'Visita a cliente potencial en San Salvador para presentación de servicios',
        contacto: '50371234567',
        encargado: 'Carlos Mendoza',
        foto: '',
        tipo: 'Seguimiento',
        pais: 'El Salvador',
        personasAlcanzadas: 3,
        contactosNuevos: 3,
        kmRecorridos: 285,
        tiempoInvertido: 8,
        gasolina: 800,
        comida: 150,
        otrosGastos: 100,
        totalInversion: 1050,
      },
    ];
    visitas.value = sortByDateDesc(visitas.value);
    filteredVisitas.value = visitas.value;
  } finally {
    loading.value = false;
  }
};

const onFilterApplied = (filtered: Visita[]) => {
  let result = filtered;
  
  if (selectedYear.value !== null) {
    result = result.filter(v => {
      if (!v.inicio) return false;
      const date = new Date(v.inicio);
      return !isNaN(date.getTime()) && date.getFullYear() === selectedYear.value;
    });
  }
  
  if (selectedMonth.value !== null) {
    result = result.filter(v => {
      if (!v.inicio) return false;
      const date = new Date(v.inicio);
      return !isNaN(date.getTime()) && (date.getMonth() + 1) === selectedMonth.value;
    });
  }
  
  filteredVisitas.value = sortByDateDesc(result);
  
  const hasModalFilter = filtered.length !== visitas.value.length;
  activeFiltersCount.value = (hasModalFilter ? 1 : 0) + (isDateFilterActive.value ? 1 : 0);
};

const openFilterModal = () => {
  isFilterModalOpen.value = true;
};

const closeFilterModal = () => {
  isFilterModalOpen.value = false;
};

onMounted(() => {
  fetchVisitas();
});

const handleAdd = () => {
  selectedVisita.value = null;
  isModalOpen.value = true;
};

const handleSelect = (visita: Visita) => {
  selectedVisita.value = visita;
  isPanelOpen.value = true;
};

const handleEdit = (visita: Visita) => {
  selectedVisita.value = visita;
  isModalOpen.value = true;
};

const handleEditFromPanel = () => {
  isPanelOpen.value = false;
  isModalOpen.value = true;
};

const handleDeleteFromPanel = async () => {
  isPanelOpen.value = false;
  selectedVisita.value = null;
  await fetchVisitas();
};

const closePanel = () => {
  isPanelOpen.value = false;
  selectedVisita.value = null;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleSave = async () => {
  await fetchVisitas();
  isModalOpen.value = false;
};
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-grid {
  display: flex;
  flex-direction: row;
  gap: 24px;
  height: calc(100vh - 180px);
}

.filter-panel {
  width: 240px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.filter-panel-header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.filter-panel-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.filter-panel-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.filter-select {
  --padding-start: 12px;
  --padding-end: 12px;
  --background: #f9fafb;
  --border-radius: 8px;
  --border-color: #e5e7eb;
  --color: #1f2937;
  height: 40px;
  font-size: 0.875rem;
}

.clear-btn {
  margin-top: auto;
  --border-radius: 8px;
}

.visitas-section {
  width: 100%;
  height: 100%;
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.add-button {
  --background: #e8913a;
  --color: white;
  font-weight: 500;
  --border-radius: 8px;
}

@media (max-width: 768px) {
  .content-padding {
    padding: 16px;
  }

  .dashboard-wrapper {
    flex-direction: column;
  }

  .dashboard-grid {
    flex-direction: column;
    height: auto;
  }

  .filter-panel {
    width: 100%;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 12px;
  }

  .filter-panel-header {
    display: none;
  }

  .filter-panel-content {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
  }

  .filter-section {
    flex: 1;
    min-width: 120px;
  }

  .filter-label {
    font-size: 0.7rem;
  }

  .clear-btn {
    margin-top: 0;
    min-width: auto;
  }
}
</style>
