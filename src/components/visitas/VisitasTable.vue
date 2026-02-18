<template>
  <div class="visitas-container">
    <div v-if="loading" class="skeleton-grid">
      <ion-skeleton-text v-for="i in 6" :key="i" animated class="skeleton-card" />
    </div>

    <div v-else class="grouped-container">
      <div v-for="group in groupedByMonth" :key="group.key" class="month-group">
        <div class="month-header">
          <span class="month-name">{{ group.monthName }}</span>
          <span class="month-count">{{ group.visitas.length }} visitas</span>
        </div>
        <div class="cards-grid">
          <div
            v-for="visita in group.visitas"
            :key="visita.id"
            class="visita-card"
            :class="{ 'is-selected': selectedVisita?.id === visita.id }"
            @click="selectVisita(visita)"
          >
        <!-- Header con imagen y tipo -->
        <div class="card-header">
          <div class="image-container">
            <img
              v-if="visita.foto"
              :src="visita.foto"
              alt="Foto de visita"
              class="visita-image"
            />
            <div v-else class="image-placeholder">
              <ion-icon :icon="imageOutline" class="placeholder-icon"></ion-icon>
            </div>
            <div class="type-badge" :class="getTipoClass(visita.tipo)">
              {{ visita.tipo }}
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="card-content">
          <h3 class="visita-title">{{ truncateText(visita.descripcion, 60) }}</h3>
          
          <div class="meta-info">
            <div class="meta-item">
              <ion-icon :icon="personOutline" class="meta-icon"></ion-icon>
              <span>{{ visita.encargado || 'Sin encargado' }}</span>
            </div>
            <div class="meta-item">
              <ion-icon :icon="calendarOutline" class="meta-icon"></ion-icon>
              <span>{{ formatDate(visita.inicio) }}</span>
            </div>
            <div class="meta-item">
              <ion-icon :icon="locationOutline" class="meta-icon"></ion-icon>
              <span>{{ visita.pais }}</span>
            </div>
          </div>

          <!-- KPIs -->
          <div class="kpi-section">
            <div class="kpi-item">
              <div class="kpi-value">{{ visita.personasAlcanzadas }}</div>
              <div class="kpi-label">Personas</div>
            </div>
            <div class="kpi-divider"></div>
            <div class="kpi-item">
              <div class="kpi-value">{{ visita.contactosNuevos }}</div>
              <div class="kpi-label">Nuevos</div>
            </div>
            <div class="kpi-divider"></div>
            <div class="kpi-item highlight">
              <div class="kpi-value">Q{{ visita.totalInversion }}</div>
              <div class="kpi-label">Inversión</div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="card-footer">
          <span class="visita-id">ID: {{ visita.id }}</span>
          <ion-button fill="clear" size="small" @click.stop="presentActionSheet(visita)">
            <ion-icon slot="icon-only" :icon="ellipsisVertical"></ion-icon>
          </ion-button>
        </div>
      </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && visitas.length === 0" class="empty-state">
      <ion-icon :icon="locationOutline" class="empty-icon"></ion-icon>
      <h3>{{ hasFilters ? 'No se encontraron visitas' : 'No hay visitas registradas' }}</h3>
      <p>{{ hasFilters ? 'Intenta ajustar los filtros para ver más resultados' : 'Comienza agregando tu primera visita' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  imageOutline,
  personOutline,
  calendarOutline,
  locationOutline,
  trashOutline,
  createOutline,
  eyeOutline,
} from 'ionicons/icons';
import { blink } from '../../lib/blink';
import { Visita } from '../../types/visita';
import { computed } from 'vue';

const API_URL = 'https://thera-ia-api-movida-app.9zx1zd.easypanel.host/';

const props = defineProps<{
  visitas: Visita[];
  loading: boolean;
  selectedVisita: Visita | null;
  hasFilters?: boolean;
}>();

const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const groupedByMonth = computed(() => {
  const groups: Record<string, { key: string; monthName: string; year: number; month: number; visitas: Visita[] }> = {};
  
  props.visitas.forEach(visita => {
    if (!visita.inicio) return;
    const date = new Date(visita.inicio);
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${month}`;
    
    if (!groups[key]) {
      groups[key] = {
        key,
        monthName: `${monthNames[month]} ${year}`,
        year,
        month,
        visitas: []
      };
    }
    groups[key].visitas.push(visita);
  });
  
  // Ordenar grupos por año y mes (más reciente primero)
  return Object.values(groups).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
});

const emit = defineEmits(['select', 'edit', 'delete']);

const selectVisita = (visita: Visita) => {
  emit('select', visita);
};

const getTipoClass = (tipo: string) => {
  const t = tipo.toLowerCase();
  if (t === 'prisma') return 'tipo-prisma';
  if (t === 'visita') return 'tipo-visita';
  if (t === 'seguimiento') return 'tipo-seguimiento';
  return 'tipo-otro';
};

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-GT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const truncateText = (text: string, maxLength: number) => {
  if (!text) return 'Sin descripción';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const presentActionSheet = async (visita: Visita) => {
  const actionSheet = await actionSheetController.create({
    header: 'Acciones',
    buttons: [
      {
        text: 'Ver detalles',
        icon: eyeOutline,
        handler: () => emit('select', visita),
      },
      {
        text: 'Editar',
        icon: createOutline,
        handler: () => emit('edit', visita),
      },
      {
        text: 'Eliminar',
        role: 'destructive',
        icon: trashOutline,
        handler: () => handleDelete(visita.id),
      },
      { text: 'Cancelar', role: 'cancel' },
    ],
  });
  await actionSheet.present();
};

const handleDelete = async (id: string) => {
  const alert = await alertController.create({
    header: 'Confirmar',
    message: '¿Estás seguro de que quieres eliminar esta visita?',
    buttons: [
      { text: 'No', role: 'cancel' },
      {
        text: 'Sí, eliminar',
        role: 'destructive',
        handler: async () => {
          try {
            await fetch(`${API_URL}/visitas/${id}`, { method: 'DELETE' });
            const toast = await toastController.create({
              message: 'Visita eliminada',
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
.visitas-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  padding: 4px;
}

.skeleton-card {
  height: 280px;
  border-radius: 16px;
  margin: 0;
}

.grouped-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.month-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.month-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 4px;
  border-bottom: 2px solid #e8913a;
  margin-bottom: 8px;
}

.month-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  text-transform: capitalize;
}

.month-count {
  font-size: 0.85rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 12px;
  border-radius: 12px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  padding: 4px;
}

.visita-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.visita-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.visita-card.is-selected {
  border-color: #e8913a;
  box-shadow: 0 0 0 2px rgba(232, 145, 58, 0.2);
}

.card-header {
  position: relative;
}

.image-container {
  position: relative;
  height: 140px;
  overflow: hidden;
  background: #f3f4f6;
}

.visita-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.visita-card:hover .visita-image {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
}

.placeholder-icon {
  font-size: 48px;
  color: #9ca3af;
}

.type-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.tipo-prisma {
  background: rgba(124, 58, 237, 0.9);
  color: white;
}

.tipo-visita {
  background: rgba(29, 78, 216, 0.9);
  color: white;
}

.tipo-seguimiento {
  background: rgba(21, 128, 61, 0.9);
  color: white;
}

.tipo-otro {
  background: rgba(180, 83, 9, 0.9);
  color: white;
}

.card-content {
  padding: 16px;
}

.visita-title {
  margin: 0 0 12px 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: #6b7280;
}

.meta-icon {
  font-size: 14px;
  color: #9ca3af;
}

.kpi-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f9fafb;
  border-radius: 12px;
}

.kpi-item {
  text-align: center;
  flex: 1;
}

.kpi-item.highlight .kpi-value {
  color: #e8913a;
  font-weight: 700;
}

.kpi-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
}

.kpi-label {
  font-size: 0.7rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 2px;
}

.kpi-divider {
  width: 1px;
  height: 30px;
  background: #e5e7eb;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid #f3f4f6;
  background: #fafafa;
}

.visita-id {
  font-size: 0.75rem;
  color: #9ca3af;
  font-family: monospace;
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
@media (max-width: 640px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>