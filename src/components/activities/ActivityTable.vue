<template>
    <div class="table-container">
        <div v-if="loading" class="skeleton-container">
            <ion-skeleton-text v-for="i in 5" :key="i" animated
                style="height: 48px; margin-bottom: 8px; border-radius: 8px;" />
        </div>

        <div v-else class="responsive-table">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>FECHA</th>
                        <th>HORA INICIO</th>
                        <th>ACTIVIDAD</th>
                        <th>TIPO</th>
                        <th>ESTADO</th>
                        <th>PAÍS</th>
                        <th class="text-right">ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="activities.length === 0">
                        <td colspan="7" class="empty-state">
                            <div class="empty-content">
                                <p>No hay actividades programadas</p>
                                <p v-if="hasFilters" class="filter-hint">Intenta ajustar los filtros para ver más
                                    resultados</p>
                            </div>
                        </td>
                    </tr>

                    <tr v-for="activity in activities" :key="activity.id" @click="$emit('select', activity)"
                        class="clickable-row">
                        <td class="font-medium">{{ formatDate(activity.fecha) }}</td>
                        <td>{{ activity.hora }}</td>
                        <td class="font-bold">{{ activity.actividad }}</td>
                        <td>{{ activity.tipo }}</td>
                        <td>
                            <ion-badge :class="getStatusClass(activity.estado)">
                                {{ activity.estado }}
                            </ion-badge>
                        </td>
                        <td>{{ activity.pais }}</td>
                        <td class="text-right" @click.stop>
                            <ion-button fill="clear" @click="presentActionSheet(activity)">
                                <ion-icon slot="icon-only" :icon="ellipsisHorizontal"></ion-icon>
                            </ion-button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    IonBadge, IonButton, IonIcon, IonSkeletonText,
    alertController, toastController, actionSheetController
} from '@ionic/vue';
import { ellipsisHorizontal, trashOutline, createOutline, eyeOutline } from 'ionicons/icons';
import { Activity } from '../../types/activity';

const API_URL = 'https://thera-ia-api-movida-app.9zx1zd.easypanel.host';

const props = defineProps<{
    activities: Activity[],
    loading: boolean,
    hasFilters?: boolean
}>();

const emit = defineEmits(['select', 'edit', 'delete']);

const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-GT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

// Manejo de Estados (Colores)
const getStatusClass = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'pendiente') return 'badge-amber';
    if (s === 'completado') return 'badge-green';
    if (s === 'cancelado') return 'badge-red';
    if (s === 'finalizado') return 'badge-indigo';
    return 'badge-blue';
};

// Menú de Acciones (Equivalente al Dropdown)
const presentActionSheet = async (activity: Activity) => {
    const actionSheet = await actionSheetController.create({
        header: 'Acciones',
        buttons: [
            {
                text: 'Ver detalles',
                icon: eyeOutline,
                handler: () => emit('select', activity)
            },
            {
                text: 'Editar',
                icon: createOutline,
                handler: () => emit('edit', activity)
            },
            {
                text: 'Eliminar',
                role: 'destructive',
                icon: trashOutline,
                handler: () => handleDelete(activity.id)
            },
            { text: 'Cancelar', role: 'cancel' }
        ]
    });
    await actionSheet.present();
};

// Lógica de Eliminación
const handleDelete = async (id: string) => {
    const alert = await alertController.create({
        header: 'Confirmar',
        message: '¿Estás seguro de que quieres eliminar esta actividad?',
        buttons: [
            { text: 'No', role: 'cancel' },
            {
                text: 'Sí, eliminar',
                role: 'destructive',
                handler: async () => {
                    try {
                        await fetch(`${API_URL}/activities/${id}`, { method: 'DELETE' });
                        const toast = await toastController.create({
                            message: 'Actividad eliminada',
                            duration: 2000,
                            color: 'success'
                        });
                        await toast.present();
                        emit('delete');
                    } catch (error) {
                        const toast = await toastController.create({
                            message: 'Error al eliminar',
                            duration: 2000,
                            color: 'danger'
                        });
                        await toast.present();
                    }
                }
            }
        ]
    });
    await alert.present();
};
</script>

<style scoped>
.table-container {
    width: 100%;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.responsive-table {
    overflow-x: auto;
}

.custom-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    text-align: left;
    font-size: 0.875rem;
    /* 14px */
}

.custom-table th {
    background: #f9fafb;
    padding: 14px 16px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #e5e7eb;
}

.custom-table td {
    padding: 14px 16px;
    border-bottom: 1px solid #f3f4f6;
    color: #374151;
    vertical-align: middle;
}

.custom-table tr:last-child td {
    border-bottom: none;
}

.clickable-row {
    transition: background-color 0.2s ease;
}

.clickable-row:hover {
    background-color: #fefce8;
    cursor: pointer;
}

.empty-state {
    height: 120px;
    text-align: center;
}

.empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #6b7280;
}

.empty-content p {
    margin: 4px 0;
}

.filter-hint {
    font-size: 0.85rem;
    color: #9ca3af;
    font-style: italic;
}

.font-medium {
    font-weight: 500;
    color: #111827;
}

.font-bold {
    font-weight: 600;
    color: #111827;
}

.text-right {
    text-align: right;
}

/* Badges refined - Matching screenshot */
ion-badge {
    padding: 4px 10px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.75rem;
    letter-spacing: 0.025em;
}

.badge-amber {
    --background: #FEF3C7;
    color: #B45309;
}

.badge-green {
    --background: #dcfce7;
    color: #15803d;
}

.badge-red {
    --background: #fee2e2;
    color: #b91c1c;
}

.badge-blue {
    background: #dbeafe;
    color: #1d4ed8;
}

.badge-indigo {
    background: #e0e7ff;
    color: #4f46e5;
}
</style>