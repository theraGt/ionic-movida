<template>
  <div class="voluntarios-layout">
    <!-- Sidebar de filtros por país -->
    <aside class="filters-sidebar">
      <div class="filter-section">
        <button 
          class="filter-btn"
          :class="{ active: selectedPais === 'all' }"
          @click="selectPais('all')"
        >
          <span class="filter-label">All</span>
        </button>
        
        <button 
          v-for="pais in paisesList"
          :key="pais.nombre"
          class="filter-btn"
          :class="{ active: selectedPais === pais.nombre }"
          @click="selectPais(pais.nombre)"
        >
          <span class="filter-label">{{ pais.nombre }}</span>
          <span class="filter-count">{{ pais.count }}</span>
        </button>
      </div>
    </aside>

    <!-- Lista de voluntarios -->
    <div class="voluntarios-list-container">
      <div v-if="loading" class="skeleton-container">
        <div v-for="i in 3" :key="i" class="skeleton-group">
          <ion-skeleton-text animated class="skeleton-title" />
          <div class="skeleton-cards">
            <ion-skeleton-text v-for="j in 2" :key="j" animated class="skeleton-card" />
          </div>
        </div>
      </div>

      <div v-else class="voluntarios-content">
        <div v-for="grupo in gruposVoluntarios" :key="grupo.region" class="region-group">
          <div class="region-header">
            <h3 class="region-title">{{ grupo.region }}</h3>
            <span class="region-count">{{ grupo.voluntarios.length }}</span>
          </div>

          <div class="voluntarios-row">
            <div
              v-for="voluntario in grupo.voluntarios"
              :key="voluntario.id"
              class="voluntario-card"
              :class="{ 'is-selected': selectedVoluntario?.id === voluntario.id }"
              @click="selectVoluntario(voluntario)"
            >
              <div class="card-main">
                <div class="avatar-container">
                  <img
                    v-if="voluntario.foto"
                    :src="voluntario.foto"
                    :alt="voluntario.nombreCompleto"
                    class="voluntario-avatar"
                  />
                  <div v-else class="avatar-placeholder">
                    <ion-icon :icon="personOutline" class="avatar-icon"></ion-icon>
                  </div>
                </div>

                <div class="voluntario-info">
                  <h4 class="voluntario-nombre">{{ voluntario.nombreCompleto }}</h4>
                  <p class="voluntario-iglesia">{{ voluntario.iglesia || 'Sin iglesia' }}</p>
                </div>

                <ion-button 
                  fill="clear" 
                  size="small" 
                  class="menu-btn"
                  @click.stop="presentActionSheet(voluntario)"
                >
                  <ion-icon slot="icon-only" :icon="ellipsisVertical"></ion-icon>
                </ion-button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="gruposVoluntarios.length === 0" class="empty-state">
          <ion-icon :icon="peopleOutline" class="empty-icon"></ion-icon>
          <h3>No hay voluntarios</h3>
          <p>No se encontraron voluntarios con los filtros seleccionados</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  IonButton,
  IonIcon,
  IonSkeletonText,
  alertController,
  toastController,
  actionSheetController,
} from '@ionic/vue';
import {
  ellipsisVertical,
  personOutline,
  peopleOutline,
  trashOutline,
  createOutline,
  eyeOutline,
} from 'ionicons/icons';
import { blink } from '../../lib/blink';
import { Voluntario } from '../../types/voluntario';

const props = defineProps<{
  voluntarios: Voluntario[];
  loading: boolean;
  selectedVoluntario: Voluntario | null;
}>();

const emit = defineEmits(['select', 'edit', 'delete']);

const selectedPais = ref('all');

// Filtrar voluntarios por país seleccionado
const voluntariosFiltrados = computed(() => {
  if (selectedPais.value === 'all') {
    return props.voluntarios;
  }
  return props.voluntarios.filter(v => v.pais === selectedPais.value);
});

// Agrupar voluntarios por departamento/región
const gruposVoluntarios = computed(() => {
  const grupos: Record<string, Voluntario[]> = {};
  
  voluntariosFiltrados.value.forEach(voluntario => {
    const region = voluntario.departamentoRegion || 'Sin región';
    if (!grupos[region]) {
      grupos[region] = [];
    }
    grupos[region].push(voluntario);
  });

  return Object.entries(grupos)
    .map(([region, voluntarios]) => ({
      region,
      voluntarios: voluntarios.sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto))
    }))
    .sort((a, b) => a.region.localeCompare(b.region));
});

// Lista de países con conteo
const paisesList = computed(() => {
  const paises: Record<string, number> = {};
  props.voluntarios.forEach(v => {
    paises[v.pais] = (paises[v.pais] || 0) + 1;
  });
  
  return Object.entries(paises)
    .map(([nombre, count]) => ({ nombre, count }))
    .sort((a, b) => b.count - a.count);
});

const selectPais = (pais: string) => {
  selectedPais.value = pais;
};

const selectVoluntario = (voluntario: Voluntario) => {
  emit('select', voluntario);
};

const presentActionSheet = async (voluntario: Voluntario) => {
  const actionSheet = await actionSheetController.create({
    header: 'Acciones',
    buttons: [
      {
        text: 'Ver detalles',
        icon: eyeOutline,
        handler: () => emit('select', voluntario),
      },
      {
        text: 'Editar',
        icon: createOutline,
        handler: () => emit('edit', voluntario),
      },
      {
        text: 'Eliminar',
        role: 'destructive',
        icon: trashOutline,
        handler: () => handleDelete(voluntario.id),
      },
      { text: 'Cancelar', role: 'cancel' },
    ],
  });
  await actionSheet.present();
};

const handleDelete = async (id: string) => {
  const alert = await alertController.create({
    header: 'Confirmar',
    message: '¿Estás seguro de que quieres eliminar este voluntario?',
    buttons: [
      { text: 'No', role: 'cancel' },
      {
        text: 'Sí, eliminar',
        role: 'destructive',
        handler: async () => {
          try {
            await blink.db.voluntarios.delete(id);
            const toast = await toastController.create({
              message: 'Voluntario eliminado',
              duration: 2000,
              color: 'success',
            });
            await toast.present();
            emit('delete');
          } catch (error) {
            const toast = await toastController.create({
              message: 'Error al eliminar',
              duration: 2000,
              color: 'danger',
            });
            await toast.present();
          }
        },
      },
    ],
  });
  await alert.present();
};
</script>

<style scoped>
.voluntarios-layout {
  display: flex;
  height: 100%;
  gap: 24px;
}

/* Sidebar de filtros */
.filters-sidebar {
  width: 200px;
  flex-shrink: 0;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 16px;
  overflow-y: auto;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.filter-btn:hover {
  background: #f3f4f6;
}

.filter-btn.active {
  background: #fef3c7;
}

.filter-label {
  font-size: 0.9rem;
  color: #374151;
  font-weight: 500;
}

.filter-btn.active .filter-label {
  color: #92400e;
  font-weight: 600;
}

.filter-count {
  font-size: 0.8rem;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 12px;
}

.filter-btn.active .filter-count {
  background: #fde68a;
  color: #92400e;
}

/* Lista de voluntarios */
.voluntarios-list-container {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}

.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.skeleton-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-title {
  width: 150px;
  height: 24px;
  border-radius: 4px;
}

.skeleton-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-card {
  height: 80px;
  border-radius: 12px;
  margin: 0;
}

.voluntarios-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.region-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.region-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.region-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.region-count {
  font-size: 0.85rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 10px;
  border-radius: 12px;
}

.voluntarios-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 12px;
}

.voluntario-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.voluntario-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #d1d5db;
}

.voluntario-card.is-selected {
  border-color: #e8913a;
  box-shadow: 0 0 0 2px rgba(232, 145, 58, 0.2);
  background: #fffbeb;
}

.card-main {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-container {
  flex-shrink: 0;
}

.voluntario-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.avatar-placeholder {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e8913a 0%, #d97706 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon {
  font-size: 28px;
  color: white;
}

.voluntario-info {
  flex: 1;
  min-width: 0;
}

.voluntario-nombre {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.voluntario-iglesia {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-btn {
  --padding-start: 8px;
  --padding-end: 8px;
  --color: #9ca3af;
}

.menu-btn:hover {
  --color: #6b7280;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #9ca3af;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  color: #d1d5db;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #6b7280;
  font-weight: 600;
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .voluntarios-layout {
    flex-direction: column;
  }

  .filters-sidebar {
    width: 100%;
    max-height: 200px;
  }

  .filter-section {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .filter-btn {
    flex: 0 0 auto;
  }
}

@media (max-width: 640px) {
  .voluntarios-row {
    grid-template-columns: 1fr;
  }
}

/* Dark Mode */
.dark .filters-sidebar {
  background: #1f2937;
  border-color: #374151;
}

.dark .filter-btn:hover {
  background: #374151;
}

.dark .filter-btn.active {
  background: #451a03;
}

.dark .filter-label {
  color: #d1d5db;
}

.dark .filter-btn.active .filter-label {
  color: #f0a85a;
}

.dark .filter-count {
  background: #374151;
  color: #9ca3af;
}

.dark .filter-btn.active .filter-count {
  background: #78350f;
  color: #f0a85a;
}

.dark .region-title {
  color: #f3f4f6;
}

.dark .region-count {
  background: #374151;
  color: #9ca3af;
}

.dark .region-header {
  border-bottom-color: #374151;
}

.dark .voluntario-card {
  background: #1f2937;
  border-color: #374151;
}

.dark .voluntario-card:hover {
  border-color: #4b5563;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark .voluntario-card.is-selected {
  border-color: #f0a85a;
  background: #451a03;
}

.dark .voluntario-nombre {
  color: #f3f4f6;
}

.dark .voluntario-iglesia {
  color: #9ca3af;
}

.dark .empty-state {
  color: #9ca3af;
}

.dark .empty-icon {
  color: #4b5563;
}

.dark .empty-state h3 {
  color: #9ca3af;
}
</style>
