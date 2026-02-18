<template>
    <ion-page>
        <div class="dashboard-wrapper">
            <Sidebar />

            <div class="main-container">
                <Header />

                <ion-content>
                    <main class="content-padding">
                        <div class="page-title-row">
                            <h1 class="page-title">Actividades Movida</h1>
                            <div class="actions-group">
                            </div>
                        </div>

                        <div class="dashboard-grid">

                            <section class="calendar-section">
                                <div class="card-container">
                                    <header class="card-header">
                                        <h2 class="card-title">Calendario</h2>
                                        <ion-button size="small" @click="handleAdd" class="add-button">
                                            <ion-icon slot="start" :icon="addOutline"></ion-icon>
                                            Add
                                        </ion-button>
                                    </header>
                                    <ActivityCalendar :activities="activities" @select-activity="handleSelect" />
                                </div>
                            </section>

                            <section class="activities-section">
                                <div class="card-container">
                                    <header class="card-header">
                                        <h2 class="card-title">Actividades</h2>
                                        <div class="header-actions">
                                            <ion-button size="small" @click="handleAdd" class="add-button">
                                                <ion-icon slot="start" :icon="addOutline"></ion-icon>
                                                Add
                                            </ion-button>
                                            <ion-button fill="clear" size="small" color="medium" @click="openFilterModal">
                                                <ion-icon slot="icon-only" :icon="funnelOutline"></ion-icon>
                                                <ion-badge v-if="activeFiltersCount > 0" color="danger" class="filter-badge">{{ activeFiltersCount }}</ion-badge>
                                            </ion-button>
                                        </div>
                                    </header>

                                    <ActivityTable :activities="filteredActivities" :loading="loading" :has-filters="activeFiltersCount > 0" @select="handleSelect" @edit="handleEdit"
                                        @delete="fetchActivities" />
                                </div>
                            </section>

                        </div>
                    </main>
                </ion-content>
            </div>

            <!-- Panel de Detalles -->
            <ActivityDetailPanel 
                :is-open="isDetailPanelOpen" 
                :activity="selectedActivity" 
                @close="isDetailPanelOpen = false"
                @edit="handlePanelEdit"
                @delete="handlePanelDelete"
                @update-status="handleUpdateStatus"
            />

            <!-- Modal de Actividad (Crear/Editar) -->
            <ActivityModal 
                :is-open="isModalOpen" 
                :activity="selectedActivity" 
                @close="isModalOpen = false"
                @save="handleSave" 
            />

            <!-- Modal de Filtros -->
            <ion-modal :is-open="isFilterModalOpen" @didDismiss="closeFilterModal" class="filter-modal">
                <ion-header>
                    <ion-toolbar>
                        <ion-buttons slot="start">
                            <ion-button @click="closeFilterModal">
                                <ion-icon :icon="chevronBackOutline"></ion-icon>
                            </ion-button>
                        </ion-buttons>
                        <ion-title>Filter</ion-title>
                    </ion-toolbar>
                </ion-header>
                
                <ion-content class="ion-padding">
                    <!-- Búsqueda -->
                    <div class="filter-section">
                        <ion-searchbar 
                            v-model="filters.busqueda" 
                            placeholder="Buscar actividad..."
                            @ionInput="applyFilters"
                            class="custom-searchbar"
                        ></ion-searchbar>
                    </div>

                    <!-- Filtro por Tipo -->
                    <div class="filter-section">
                        <div class="filter-header" @click="toggleSection('tipo')">
                            <span class="filter-label">TIPO</span>
                            <ion-icon :icon="expandedSections.tipo ? chevronUpOutline : chevronDownOutline" class="expand-icon"></ion-icon>
                        </div>
                        <div v-show="expandedSections.tipo" class="filter-options">
                            <ion-item v-for="tipo in tiposOptions" :key="tipo" lines="none">
                                <ion-checkbox 
                                    slot="start" 
                                    :checked="filters.tipo.includes(tipo)"
                                    @ionChange="toggleFilter('tipo', tipo)"
                                ></ion-checkbox>
                                <ion-label>{{ tipo }}</ion-label>
                            </ion-item>
                        </div>
                    </div>

                    <!-- Filtro por Estado -->
                    <div class="filter-section">
                        <div class="filter-header" @click="toggleSection('estado')">
                            <span class="filter-label">ESTADO</span>
                            <ion-icon :icon="expandedSections.estado ? chevronUpOutline : chevronDownOutline" class="expand-icon"></ion-icon>
                        </div>
                        <div v-show="expandedSections.estado" class="filter-options">
                            <ion-item v-for="estado in estadosOptions" :key="estado" lines="none">
                                <ion-checkbox 
                                    slot="start" 
                                    :checked="filters.estado.includes(estado)"
                                    @ionChange="toggleFilter('estado', estado)"
                                ></ion-checkbox>
                                <ion-label>{{ estado }}</ion-label>
                            </ion-item>
                        </div>
                    </div>

                    <!-- Filtro por País -->
                    <div class="filter-section">
                        <div class="filter-header" @click="toggleSection('pais')">
                            <span class="filter-label">PAÍS</span>
                            <ion-icon :icon="expandedSections.pais ? chevronUpOutline : chevronDownOutline" class="expand-icon"></ion-icon>
                        </div>
                        <div v-show="expandedSections.pais" class="filter-options">
                            <ion-item v-for="pais in paisesOptions" :key="pais" lines="none">
                                <ion-checkbox 
                                    slot="start" 
                                    :checked="filters.pais.includes(pais)"
                                    @ionChange="toggleFilter('pais', pais)"
                                ></ion-checkbox>
                                <ion-label>{{ pais }}</ion-label>
                            </ion-item>
                        </div>
                    </div>

                    <!-- Filtro por Fecha -->
                    <div class="filter-section">
                        <div class="filter-header" @click="toggleSection('fecha')">
                            <span class="filter-label">FECHA</span>
                            <ion-icon :icon="expandedSections.fecha ? chevronUpOutline : chevronDownOutline" class="expand-icon"></ion-icon>
                        </div>
                        <div v-show="expandedSections.fecha" class="filter-options date-range">
                            <ion-item lines="none">
                                <ion-label position="stacked">Desde</ion-label>
                                <ion-input 
                                    type="date" 
                                    v-model="filters.fechaDesde"
                                    @ionChange="applyFilters"
                                ></ion-input>
                            </ion-item>
                            <ion-item lines="none">
                                <ion-label position="stacked">Hasta</ion-label>
                                <ion-input 
                                    type="date" 
                                    v-model="filters.fechaHasta"
                                    @ionChange="applyFilters"
                                ></ion-input>
                            </ion-item>
                        </div>
                    </div>
                </ion-content>

                <ion-footer class="filter-footer">
                    <ion-button fill="clear" color="medium" @click="clearFilters">
                        Clear
                    </ion-button>
                    <ion-button fill="clear" color="warning" @click="closeFilterModal">
                        Done
                    </ion-button>
                </ion-footer>
            </ion-modal>
        </div>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
    IonPage, IonContent, IonButton, IonIcon, IonBadge,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonItem, IonLabel, IonInput,
    IonCheckbox, IonSearchbar, toastController
} from '@ionic/vue';
import { addOutline, funnelOutline, chevronBackOutline, chevronUpOutline, chevronDownOutline } from 'ionicons/icons';

// Layout & Componentes
import Sidebar from '@/components/Layout/Sidebar.vue';
import Header from '@/components/Layout/Header.vue';
import ActivityTable from '@/components/activities/ActivityTable.vue';
import ActivityCalendar from '@/components/activities/ActivityCalendar.vue';
import ActivityModal from '@/components/activities/ActivityModal.vue';
import ActivityDetailPanel from '@/components/activities/ActivityDetailPanel.vue';

// Lógica y Tipos
import { Activity } from '@/types/activity';

const API_URL = 'https://thera-ia-api-movida-app.9zx1zd.easypanel.host/';

const activities = ref<Activity[]>([]);
const filteredActivities = ref<Activity[]>([]);
const loading = ref(true);
const isModalOpen = ref(false);
const isDetailPanelOpen = ref(false);
const isFilterModalOpen = ref(false);
const selectedActivity = ref<Activity | null>(null);

// Filtros
const filters = ref({
  tipo: [] as string[],
  estado: [] as string[],
  pais: [] as string[],
  fechaDesde: '',
  fechaHasta: '',
  busqueda: ''
});

// Opciones disponibles para filtros
const tiposOptions = ['Personal', 'Reuniones', 'Misiones', 'Misionero', 'Devocionales', 'Cima', 'Voluntariado'];
const estadosOptions = ['Pendiente', 'Completado', 'Cancelado'];
const paisesOptions = ['Guatemala', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panamá'];

// Secciones expandidas del modal
const expandedSections = ref({
  tipo: true,
  estado: true,
  pais: true,
  fecha: true
});

const fetchActivities = async () => {
    try {
        loading.value = true;
        const response = await fetch(`${API_URL}/activities`);
        if (!response.ok) throw new Error('Error fetching activities');
        const data = await response.json();
        activities.value = data as Activity[];
        applyFilters();
    } catch (error) {
        console.error('Error:', error);
        const toast = await toastController.create({
            message: 'Error al cargar actividades',
            duration: 2000,
            color: 'danger'
        });
        await toast.present();
    } finally {
        loading.value = false;
    }
};

// Aplicar filtros
const applyFilters = () => {
    let result = [...activities.value];
    
    // Filtrar por tipo
    if (filters.value.tipo.length > 0) {
        result = result.filter(a => filters.value.tipo.includes(a.tipo));
    }
    
    // Filtrar por estado
    if (filters.value.estado.length > 0) {
        result = result.filter(a => filters.value.estado.includes(a.estado));
    }
    
    // Filtrar por país
    if (filters.value.pais.length > 0) {
        result = result.filter(a => filters.value.pais.includes(a.pais));
    }
    
    // Filtrar por fecha desde
    if (filters.value.fechaDesde) {
        result = result.filter(a => a.fecha >= filters.value.fechaDesde);
    }
    
    // Filtrar por fecha hasta
    if (filters.value.fechaHasta) {
        result = result.filter(a => a.fecha <= filters.value.fechaHasta);
    }
    
    // Filtrar por búsqueda (actividad)
    if (filters.value.busqueda) {
        const search = filters.value.busqueda.toLowerCase();
        result = result.filter(a => 
            a.actividad.toLowerCase().includes(search) ||
            a.tipo.toLowerCase().includes(search) ||
            a.estado.toLowerCase().includes(search)
        );
    }
    
    filteredActivities.value = result;
};

const clearFilters = () => {
    filters.value = {
        tipo: [],
        estado: [],
        pais: [],
        fechaDesde: '',
        fechaHasta: '',
        busqueda: ''
    };
    applyFilters();
};

const openFilterModal = () => {
    isFilterModalOpen.value = true;
};

const closeFilterModal = () => {
    isFilterModalOpen.value = false;
};

const toggleSection = (section: keyof typeof expandedSections.value) => {
    expandedSections.value[section] = !expandedSections.value[section];
};

const toggleFilter = (filterType: 'tipo' | 'estado' | 'pais', value: string) => {
    const index = filters.value[filterType].indexOf(value);
    if (index > -1) {
        filters.value[filterType].splice(index, 1);
    } else {
        filters.value[filterType].push(value);
    }
    applyFilters();
};

// Carga inicial
onMounted(() => {
    fetchActivities();
});

const handleAdd = () => {
    selectedActivity.value = null;
    isDetailPanelOpen.value = false;
    isModalOpen.value = true;
};

const handleSelect = (activity: Activity) => {
    selectedActivity.value = activity;
    isDetailPanelOpen.value = true;
};

const handleEdit = (activity: Activity) => {
    selectedActivity.value = activity;
    isDetailPanelOpen.value = false;
    isModalOpen.value = true;
};

const handlePanelEdit = (activity: Activity | null) => {
    if (activity) {
        selectedActivity.value = activity;
        isDetailPanelOpen.value = false;
        isModalOpen.value = true;
    }
};

const handlePanelDelete = async (id: string | undefined) => {
    if (id) {
        try {
            await fetch(`${API_URL}/activities/${id}`, { method: 'DELETE' });
            const toast = await toastController.create({
                message: 'Actividad eliminada',
                duration: 2000,
                color: 'success'
            });
            await toast.present();
            isDetailPanelOpen.value = false;
            await fetchActivities();
        } catch (error) {
            console.error('Error:', error);
            const toast = await toastController.create({
                message: 'Error al eliminar la actividad',
                duration: 2000,
                color: 'danger'
            });
            await toast.present();
        }
    }
};

const handleSave = async () => {
    await fetchActivities();
    isModalOpen.value = false;
    isDetailPanelOpen.value = false;
};

const handleUpdateStatus = async ({ activity, newStatus }: { activity: Activity; newStatus: string }) => {
    try {
        await fetch(`${API_URL}/activities/${activity.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...activity, estado: newStatus }),
        });
        const toast = await toastController.create({
            message: 'Estado actualizado',
            duration: 2000,
            color: 'success'
        });
        await toast.present();
        await fetchActivities();
    } catch (error) {
        console.error('Error:', error);
        const toast = await toastController.create({
            message: 'Error al actualizar estado',
            duration: 2000,
            color: 'danger'
        });
        await toast.present();
    }
};

// Contar filtros activos
const activeFiltersCount = computed(() => {
    let count = 0;
    if (filters.value.tipo.length > 0) count++;
    if (filters.value.estado.length > 0) count++;
    if (filters.value.pais.length > 0) count++;
    if (filters.value.fechaDesde) count++;
    if (filters.value.fechaHasta) count++;
    if (filters.value.busqueda) count++;
    return count;
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

.dashboard-grid {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.calendar-section {
    width: 100%;
}

.activities-section {
    width: 100%;
}

/* Card Styling */
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
}

.card-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    color: #1f2937;
}

.add-button {
    --background: #E8913A;
    --color: white;
    font-weight: 500;
    --border-radius: 8px;
}

.header-actions {
  position: relative;
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
  display: flex;
  align-items: center;
  justify-content: center;
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
  cursor: pointer;
}

.filter-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.expand-icon {
  color: #6b7280;
  font-size: 1.2rem;
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
}

.date-range ion-item {
  --padding-start: 0;
}

.date-range ion-label {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 4px;
}

.custom-searchbar {
  --background: #f3f4f6;
  --border-radius: 8px;
  padding: 0;
}

.filter-footer {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background: #ffffff;
}

.filter-footer ion-button {
  font-weight: 500;
}

/* Responsive */
@media (min-width: 768px) {
  .filter-modal {
    --width: 400px;
    --height: 100%;
    --border-radius: 0;
  }
}

@media (max-width: 768px) {
    .content-padding {
        padding: 12px;
        overflow-x: hidden;
    }

    .page-title {
        font-size: 1.2rem;
    }

    .page-title-row {
        margin-bottom: 12px;
        flex-wrap: wrap;
    }

    .actions-group {
        display: flex;
        gap: 4px;
    }

    .dashboard-grid {
        gap: 16px;
    }

    .calendar-section {
        width: 100%;
        min-height: 460px;
    }

    .activities-section {
        width: 100%;
        min-height: 300px;
    }

    .card-container {
        padding: 12px;
        border-radius: 10px;
    }

    .card-header {
        margin-bottom: 10px;
        flex-wrap: wrap;
        gap: 8px;
    }

    .card-title {
        font-size: 1rem;
    }

    .header-actions {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .add-button {
        --padding-start: 10px;
        --padding-end: 10px;
        font-size: 0.8rem;
        height: 32px;
    }

    .add-button ion-icon {
        font-size: 14px;
        margin-right: 4px;
    }

    ion-button[fill="clear"] {
        --padding-start: 6px;
        --padding-end: 6px;
    }
}

@media (max-width: 480px) {
    .content-padding {
        padding: 8px;
    }

    .page-title {
        font-size: 1.1rem;
    }

    .page-title-row {
        margin-bottom: 8px;
    }

    .dashboard-grid {
        gap: 12px;
    }

    .calendar-section {
        min-height: 410px;
    }

    .activities-section {
        min-height: 250px;
    }

    .card-container {
        padding: 10px;
        border-radius: 8px;
    }

    .card-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .card-title {
        font-size: 0.95rem;
    }

    .header-actions {
        width: 100%;
        justify-content: flex-start;
        gap: 8px;
    }

    .add-button {
        font-size: 0.75rem;
        height: 30px;
    }
}
</style>