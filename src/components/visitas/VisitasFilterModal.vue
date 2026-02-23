<template>
  <ion-modal
    :is-open="isOpen"
    @didDismiss="$emit('close')"
    class="filter-modal"
  >
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="$emit('close')">
            <ion-icon :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Filter</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="clearAllFilters" color="medium">
            Clear
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="filter-content">
      <!-- ID VISITA -->
      <div class="filter-item" @click="toggleSection('idVisita')">
        <div class="filter-item-content">
          <span class="filter-item-label">ID VISITA</span>
          <ion-icon :icon="expandedSections.idVisita ? chevronUp : chevronForward" class="filter-item-arrow"></ion-icon>
        </div>
        <div v-if="expandedSections.idVisita" class="filter-item-options" @click.stop>
          <ion-searchbar
            v-model="filters.idVisita"
            placeholder="Buscar ID Visita..."
            @ionInput="applyFilters"
            class="filter-searchbar"
          ></ion-searchbar>
        </div>
      </div>

      <!-- ID ACTIVIDAD -->
      <div class="filter-item" @click="toggleSection('idActividad')">
        <div class="filter-item-content">
          <span class="filter-item-label">ID ACTIVIDAD</span>
          <ion-icon :icon="expandedSections.idActividad ? chevronUp : chevronForward" class="filter-item-arrow"></ion-icon>
        </div>
        <div v-if="expandedSections.idActividad" class="filter-item-options" @click.stop>
          <ion-searchbar
            v-model="filters.idActividad"
            placeholder="Buscar ID Actividad..."
            @ionInput="applyFilters"
            class="filter-searchbar"
          ></ion-searchbar>
        </div>
      </div>

      <!-- INICIO -->
      <div class="filter-item" @click="toggleSection('inicio')">
        <div class="filter-item-content">
          <span class="filter-item-label">INICIO</span>
          <ion-icon :icon="expandedSections.inicio ? chevronUp : chevronForward" class="filter-item-arrow"></ion-icon>
        </div>
        <div v-if="expandedSections.inicio" class="filter-item-options date-options" @click.stop>
          <div class="date-field">
            <label>Desde</label>
            <ion-datetime
              v-model="filters.fechaDesde"
              presentation="date"
              @ionChange="applyFilters"
            ></ion-datetime>
          </div>
          <div class="date-field">
            <label>Hasta</label>
            <ion-datetime
              v-model="filters.fechaHasta"
              presentation="date"
              @ionChange="applyFilters"
            ></ion-datetime>
          </div>
        </div>
      </div>

      <!-- COORDENADA -->
      <div class="filter-item" @click="toggleSection('coordenada')">
        <div class="filter-item-content">
          <span class="filter-item-label">COORDENADA</span>
          <ion-icon :icon="expandedSections.coordenada ? chevronUp : chevronForward" class="filter-item-arrow"></ion-icon>
        </div>
        <div v-if="expandedSections.coordenada" class="filter-item-options" @click.stop>
          <ion-searchbar
            v-model="filters.coordenada"
            placeholder="Buscar coordenada..."
            @ionInput="applyFilters"
            class="filter-searchbar"
          ></ion-searchbar>
        </div>
      </div>

      <!-- DESCRIPCION -->
      <div class="filter-item" @click="toggleSection('descripcion')">
        <div class="filter-item-content">
          <span class="filter-item-label">DESCRIPCION</span>
          <ion-icon :icon="expandedSections.descripcion ? chevronUp : chevronForward" class="filter-item-arrow"></ion-icon>
        </div>
        <div v-if="expandedSections.descripcion" class="filter-item-options" @click.stop>
          <ion-searchbar
            v-model="filters.descripcion"
            placeholder="Buscar en descripción..."
            @ionInput="applyFilters"
            class="filter-searchbar"
          ></ion-searchbar>
        </div>
      </div>

      <!-- CONTACTO -->
      <div class="filter-item" @click="toggleSection('contacto')">
        <div class="filter-item-content">
          <span class="filter-item-label">CONTACTO</span>
          <ion-icon :icon="expandedSections.contacto ? chevronUp : chevronForward" class="filter-item-arrow"></ion-icon>
        </div>
        <div v-if="expandedSections.contacto" class="filter-item-options" @click.stop>
          <ion-searchbar
            v-model="filters.contacto"
            placeholder="Buscar contacto..."
            @ionInput="applyFilters"
            class="filter-searchbar"
          ></ion-searchbar>
        </div>
      </div>

      <!-- ENCARGADO -->
      <div class="filter-item" @click="toggleSection('encargado')">
        <div class="filter-item-content">
          <span class="filter-item-label">ENCARGADO</span>
          <ion-icon :icon="expandedSections.encargado ? chevronUp : chevronForward" class="filter-item-arrow"></ion-icon>
        </div>
        <div v-if="expandedSections.encargado" class="filter-item-options" @click.stop>
          <ion-searchbar
            v-model="filters.encargado"
            placeholder="Buscar encargado..."
            @ionInput="applyFilters"
            class="filter-searchbar"
          ></ion-searchbar>
        </div>
      </div>

      <!-- FOTO -->
      <div class="filter-item" @click="toggleSection('foto')">
        <div class="filter-item-content">
          <span class="filter-item-label">FOTO</span>
          <ion-icon :icon="expandedSections.foto ? chevronUp : chevronForward" class="filter-item-arrow"></ion-icon>
        </div>
        <div v-if="expandedSections.foto" class="filter-item-options" @click.stop>
          <ion-radio-group v-model="filters.foto" @ionChange="applyFilters">
            <ion-item lines="none">
              <ion-radio slot="start" value=""></ion-radio>
              <ion-label>Todas</ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-radio slot="start" value="with"></ion-radio>
              <ion-label>Con foto</ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-radio slot="start" value="without"></ion-radio>
              <ion-label>Sin foto</ion-label>
            </ion-item>
          </ion-radio-group>
        </div>
      </div>

      <!-- TIPO -->
      <div class="filter-item" @click="toggleSection('tipo')">
        <div class="filter-item-content">
          <span class="filter-item-label">TIPO</span>
          <ion-icon :icon="expandedSections.tipo ? chevronUp : chevronForward" class="filter-item-arrow"></ion-icon>
        </div>
        <div v-if="expandedSections.tipo" class="filter-item-options" @click.stop>
          <ion-item v-for="tipo in tipoOptions" :key="tipo" lines="none">
            <ion-checkbox
              slot="start"
              :checked="filters.tipo.includes(tipo)"
              @ionChange="toggleArrayFilter('tipo', tipo)"
            ></ion-checkbox>
            <ion-label>{{ tipo }}</ion-label>
          </ion-item>
        </div>
      </div>

      <!-- PAIS -->
      <div class="filter-item" @click="toggleSection('pais')">
        <div class="filter-item-content">
          <span class="filter-item-label">PAIS</span>
          <ion-icon :icon="expandedSections.pais ? chevronUp : chevronForward" class="filter-item-arrow"></ion-icon>
        </div>
        <div v-if="expandedSections.pais" class="filter-item-options" @click.stop>
          <ion-item v-for="pais in paisOptions" :key="pais" lines="none">
            <ion-checkbox
              slot="start"
              :checked="filters.pais.includes(pais)"
              @ionChange="toggleArrayFilter('pais', pais)"
            ></ion-checkbox>
            <ion-label>{{ pais }}</ion-label>
          </ion-item>
        </div>
      </div>

      <!-- PERSONAS ALCANZADAS -->
      <div class="filter-item" @click="toggleSection('personasAlcanzadas')">
        <div class="filter-item-content">
          <span class="filter-item-label">PERSONAS ALCANZADAS</span>
          <ion-icon :icon="expandedSections.personasAlcanzadas ? chevronUp : chevronForward" class="filter-item-arrow"></ion-icon>
        </div>
        <div v-if="expandedSections.personasAlcanzadas" class="filter-item-options range-options" @click.stop>
          <div class="range-field">
            <label>Mínimo</label>
            <ion-input
              v-model.number="filters.personasMin"
              type="number"
              min="0"
              placeholder="0"
              @ionChange="applyFilters"
            ></ion-input>
          </div>
          <div class="range-field">
            <label>Máximo</label>
            <ion-input
              v-model.number="filters.personasMax"
              type="number"
              min="0"
              placeholder="∞"
              @ionChange="applyFilters"
            ></ion-input>
          </div>
        </div>
      </div>

      <!-- CONTACTOS NUEVOS -->
      <div class="filter-item" @click="toggleSection('contactosNuevos')">
        <div class="filter-item-content">
          <span class="filter-item-label">CONTACTOS NUEVOS</span>
          <ion-icon :icon="expandedSections.contactosNuevos ? chevronUp : chevronForward" class="filter-item-arrow"></ion-icon>
        </div>
        <div v-if="expandedSections.contactosNuevos" class="filter-item-options range-options" @click.stop>
          <div class="range-field">
            <label>Mínimo</label>
            <ion-input
              v-model.number="filters.contactosMin"
              type="number"
              min="0"
              placeholder="0"
              @ionChange="applyFilters"
            ></ion-input>
          </div>
          <div class="range-field">
            <label>Máximo</label>
            <ion-input
              v-model.number="filters.contactosMax"
              type="number"
              min="0"
              placeholder="∞"
              @ionChange="applyFilters"
            ></ion-input>
          </div>
        </div>
      </div>

      <!-- KM RECORRIDOS -->
      <div class="filter-item" @click="toggleSection('kmRecorridos')">
        <div class="filter-item-content">
          <span class="filter-item-label">KM RECORRIDOS</span>
          <ion-icon :icon="expandedSections.kmRecorridos ? chevronUp : chevronForward" class="filter-item-arrow"></ion-icon>
        </div>
        <div v-if="expandedSections.kmRecorridos" class="filter-item-options range-options" @click.stop>
          <div class="range-field">
            <label>Mínimo</label>
            <ion-input
              v-model.number="filters.kmMin"
              type="number"
              min="0"
              step="0.1"
              placeholder="0"
              @ionChange="applyFilters"
            ></ion-input>
          </div>
          <div class="range-field">
            <label>Máximo</label>
            <ion-input
              v-model.number="filters.kmMax"
              type="number"
              min="0"
              step="0.1"
              placeholder="∞"
              @ionChange="applyFilters"
            ></ion-input>
          </div>
        </div>
      </div>

      <!-- GASOLINA -->
      <div class="filter-item" @click="toggleSection('gasolina')">
        <div class="filter-item-content">
          <span class="filter-item-label">GASOLINA</span>
          <ion-icon :icon="expandedSections.gasolina ? chevronUp : chevronForward" class="filter-item-arrow"></ion-icon>
        </div>
        <div v-if="expandedSections.gasolina" class="filter-item-options range-options" @click.stop>
          <div class="range-field">
            <label>Q Mínimo</label>
            <ion-input
              v-model.number="filters.gasolinaMin"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              @ionChange="applyFilters"
            ></ion-input>
          </div>
          <div class="range-field">
            <label>Q Máximo</label>
            <ion-input
              v-model.number="filters.gasolinaMax"
              type="number"
              min="0"
              step="0.01"
              placeholder="∞"
              @ionChange="applyFilters"
            ></ion-input>
          </div>
        </div>
      </div>

      <!-- COMIDA -->
      <div class="filter-item" @click="toggleSection('comida')">
        <div class="filter-item-content">
          <span class="filter-item-label">COMIDA</span>
          <ion-icon :icon="expandedSections.comida ? chevronUp : chevronForward" class="filter-item-arrow"></ion-icon>
        </div>
        <div v-if="expandedSections.comida" class="filter-item-options range-options" @click.stop>
          <div class="range-field">
            <label>Q Mínimo</label>
            <ion-input
              v-model.number="filters.comidaMin"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              @ionChange="applyFilters"
            ></ion-input>
          </div>
          <div class="range-field">
            <label>Q Máximo</label>
            <ion-input
              v-model.number="filters.comidaMax"
              type="number"
              min="0"
              step="0.01"
              placeholder="∞"
              @ionChange="applyFilters"
            ></ion-input>
          </div>
        </div>
      </div>

      <!-- OTROS GASTOS -->
      <div class="filter-item" @click="toggleSection('otrosGastos')">
        <div class="filter-item-content">
          <span class="filter-item-label">OTROS GASTOS</span>
          <ion-icon :icon="expandedSections.otrosGastos ? chevronUp : chevronForward" class="filter-item-arrow"></ion-icon>
        </div>
        <div v-if="expandedSections.otrosGastos" class="filter-item-options range-options" @click.stop>
          <div class="range-field">
            <label>Q Mínimo</label>
            <ion-input
              v-model.number="filters.otrosMin"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              @ionChange="applyFilters"
            ></ion-input>
          </div>
          <div class="range-field">
            <label>Q Máximo</label>
            <ion-input
              v-model.number="filters.otrosMax"
              type="number"
              min="0"
              step="0.01"
              placeholder="∞"
              @ionChange="applyFilters"
            ></ion-input>
          </div>
        </div>
      </div>
    </ion-content>

    <ion-footer class="filter-footer">
      <ion-button expand="block" class="apply-button" @click="$emit('close')">
        Mostrar {{ filteredCount }} resultados
      </ion-button>
    </ion-footer>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon,
  IonSearchbar,
  IonDatetime,
  IonInput,
  IonRadioGroup,
  IonRadio,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonFooter
} from '@ionic/vue';
import {
  arrowBack,
  chevronForward,
  chevronUp
} from 'ionicons/icons';
import { Visita } from '@/types/visita';

const props = defineProps<{
  isOpen: boolean;
  visitas: Visita[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'filter', filtered: Visita[]): void;
}>();

// Opciones para filtros de selección
const tipoOptions = ['Prisma', 'Visita', 'Seguimiento', 'Otro'];
const paisOptions = ['Guatemala', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panamá'];

// Estado de filtros
const filters = ref({
  idVisita: '',
  idActividad: '',
  fechaDesde: '',
  fechaHasta: '',
  coordenada: '',
  descripcion: '',
  contacto: '',
  encargado: '',
  foto: '',
  tipo: [] as string[],
  pais: [] as string[],
  personasMin: null as number | null,
  personasMax: null as number | null,
  contactosMin: null as number | null,
  contactosMax: null as number | null,
  kmMin: null as number | null,
  kmMax: null as number | null,
  gasolinaMin: null as number | null,
  gasolinaMax: null as number | null,
  comidaMin: null as number | null,
  comidaMax: null as number | null,
  otrosMin: null as number | null,
  otrosMax: null as number | null,
});

// Estado de secciones expandidas
const expandedSections = ref<Record<string, boolean>>({
  idVisita: false,
  idActividad: false,
  inicio: false,
  coordenada: false,
  descripcion: false,
  contacto: false,
  encargado: false,
  foto: false,
  tipo: false,
  pais: false,
  personasAlcanzadas: false,
  contactosNuevos: false,
  kmRecorridos: false,
  gasolina: false,
  comida: false,
  otrosGastos: false,
});

// Conteo de resultados filtrados
const filteredCount = computed(() => {
  return applyFiltersLogic().length;
});

// Toggle de sección
const toggleSection = (section: string) => {
  expandedSections.value[section] = !expandedSections.value[section];
};

// Toggle para filtros de array (tipo, pais)
const toggleArrayFilter = (key: 'tipo' | 'pais', value: string) => {
  const index = filters.value[key].indexOf(value);
  if (index > -1) {
    filters.value[key].splice(index, 1);
  } else {
    filters.value[key].push(value);
  }
  applyFilters();
};

// Aplicar filtros
const applyFilters = () => {
  const filtered = applyFiltersLogic();
  emit('filter', filtered);
};

// Lógica de filtrado
const applyFiltersLogic = (): Visita[] => {
  return props.visitas.filter(visita => {
    // ID Visita
    if (filters.value.idVisita && !visita.id.toLowerCase().includes(filters.value.idVisita.toLowerCase())) {
      return false;
    }

    // ID Actividad
    if (filters.value.idActividad && !visita.idActividad.toLowerCase().includes(filters.value.idActividad.toLowerCase())) {
      return false;
    }

    // Fecha
    if (filters.value.fechaDesde) {
      const fechaVisita = new Date(visita.inicio);
      const fechaDesde = new Date(filters.value.fechaDesde);
      if (fechaVisita < fechaDesde) return false;
    }
    if (filters.value.fechaHasta) {
      const fechaVisita = new Date(visita.inicio);
      const fechaHasta = new Date(filters.value.fechaHasta);
      if (fechaVisita > fechaHasta) return false;
    }

    // Coordenada
    if (filters.value.coordenada && !visita.coordenada.toLowerCase().includes(filters.value.coordenada.toLowerCase())) {
      return false;
    }

    // Descripción
    if (filters.value.descripcion && !visita.descripcion.toLowerCase().includes(filters.value.descripcion.toLowerCase())) {
      return false;
    }

    // Contacto
    if (filters.value.contacto && !visita.contacto.toLowerCase().includes(filters.value.contacto.toLowerCase())) {
      return false;
    }

    // Encargado
    if (filters.value.encargado && !visita.encargado.toLowerCase().includes(filters.value.encargado.toLowerCase())) {
      return false;
    }

    // Foto
    if (filters.value.foto === 'with' && !visita.foto) return false;
    if (filters.value.foto === 'without' && visita.foto) return false;

    // Tipo
    if (filters.value.tipo.length > 0 && !filters.value.tipo.includes(visita.tipo)) {
      return false;
    }

    // País
    if (filters.value.pais.length > 0 && !filters.value.pais.includes(visita.pais)) {
      return false;
    }

    // Personas Alcanzadas
    if (filters.value.personasMin !== null && visita.personasAlcanzadas < filters.value.personasMin) return false;
    if (filters.value.personasMax !== null && visita.personasAlcanzadas > filters.value.personasMax) return false;

    // Contactos Nuevos
    if (filters.value.contactosMin !== null && visita.contactosNuevos < filters.value.contactosMin) return false;
    if (filters.value.contactosMax !== null && visita.contactosNuevos > filters.value.contactosMax) return false;

    // KM Recorridos
    if (filters.value.kmMin !== null && visita.kmRecorridos < filters.value.kmMin) return false;
    if (filters.value.kmMax !== null && visita.kmRecorridos > filters.value.kmMax) return false;

    // Gasolina
    if (filters.value.gasolinaMin !== null && visita.gasolina < filters.value.gasolinaMin) return false;
    if (filters.value.gasolinaMax !== null && visita.gasolina > filters.value.gasolinaMax) return false;

    // Comida
    if (filters.value.comidaMin !== null && visita.comida < filters.value.comidaMin) return false;
    if (filters.value.comidaMax !== null && visita.comida > filters.value.comidaMax) return false;

    // Otros Gastos
    if (filters.value.otrosMin !== null && visita.otrosGastos < filters.value.otrosMin) return false;
    if (filters.value.otrosMax !== null && visita.otrosGastos > filters.value.otrosMax) return false;

    return true;
  });
};

// Limpiar todos los filtros
const clearAllFilters = () => {
  filters.value = {
    idVisita: '',
    idActividad: '',
    fechaDesde: '',
    fechaHasta: '',
    coordenada: '',
    descripcion: '',
    contacto: '',
    encargado: '',
    foto: '',
    tipo: [],
    pais: [],
    personasMin: null,
    personasMax: null,
    contactosMin: null,
    contactosMax: null,
    kmMin: null,
    kmMax: null,
    gasolinaMin: null,
    gasolinaMax: null,
    comidaMin: null,
    comidaMax: null,
    otrosMin: null,
    otrosMax: null,
  };
  applyFilters();
};
</script>

<style scoped>
.filter-modal {
  --width: 100%;
  --height: 100%;
}

.filter-content {
  --background: #ffffff;
}

.filter-item {
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
}

.filter-item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.filter-item-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1f2937;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.filter-item-arrow {
  font-size: 1.2rem;
  color: #6b7280;
}

.filter-item-options {
  padding: 0 16px 16px 16px;
  background: #f9fafb;
}

.filter-searchbar {
  --background: #ffffff;
  --border-radius: 8px;
  padding: 0;
}

.date-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.date-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-field label {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
}

.range-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.range-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.range-field label {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
}

.range-field ion-input {
  --background: #ffffff;
  --padding-start: 12px;
  --padding-end: 12px;
  --padding-top: 10px;
  --padding-bottom: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.filter-footer {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

.apply-button {
  --background: #e8913a;
  --color: white;
  --border-radius: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Estilos para checkboxes y radios */
ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
  --min-height: 44px;
}

ion-checkbox {
  --checkbox-background: #ffffff;
  --checkbox-background-checked: #e8913a;
  --border-color: #d1d5db;
  --border-color-checked: #e8913a;
  --checkmark-color: #ffffff;
}

ion-radio {
  --color: #d1d5db;
  --color-checked: #e8913a;
}

@media (min-width: 768px) {
  .filter-modal {
    --width: 400px;
    --height: 100%;
  }
}

/* Dark Mode */
.dark .filter-modal {
  --background: #1f2937;
}

.dark .filter-content {
  --background: #111827;
}

.dark .filter-item {
  border-bottom-color: #374151;
}

.dark .filter-item-label {
  color: #f3f4f6;
}

.dark .filter-item-arrow {
  color: #6b7280;
}

.dark .filter-item-options {
  background: #1f2937;
}

.dark .filter-searchbar {
  --background: #374151;
}

.dark .date-field label {
  color: #9ca3af;
}

.dark .range-field label {
  color: #9ca3af;
}

.dark .range-field ion-input {
  --background: #374151;
  border-color: #4b5563;
  color: #f3f4f6;
}

.dark .filter-footer {
  border-top-color: #374151;
  background: #1f2937;
}

.dark ion-item {
  --background: transparent;
}

.dark ion-checkbox {
  --checkbox-background: #374151;
  --border-color: #4b5563;
}

.dark ion-radio {
  --color: #6b7280;
}
</style>
