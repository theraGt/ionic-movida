<template>
  <div
    class="producto-card"
    :class="{ selected: isSelected, agotado: producto.estado === 'agotado' }"
    @click="$emit('select', producto)"
  >
    <div class="producto-imagen">
      <img v-if="producto.foto" :src="producto.foto" :alt="producto.nombre" />
      <div v-else class="placeholder-imagen">
        <ion-icon :icon="imageOutline" />
      </div>
      <div v-if="producto.estado === 'agotado'" class="estado-badge agotado">Agotado</div>
      <div v-if="producto.estado === 'nuevo'" class="estado-badge nuevo">Nuevo</div>
    </div>
    
    <div class="producto-info">
      <h4 class="producto-nombre">{{ producto.nombre }}</h4>
      <p class="producto-categoria">{{ producto.categoria }}</p>
    </div>
    
    <button class="menu-btn" @click.stop="$emit('menu', producto)">
      <ion-icon :icon="ellipsisVertical" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { imageOutline, ellipsisVertical } from 'ionicons/icons';
import type { Producto } from '@/types/kiosco';

interface Props {
  producto: Producto;
  isSelected: boolean;
}

defineProps<Props>();

defineEmits<{
  (e: 'select', producto: Producto): void;
  (e: 'menu', producto: Producto): void;
}>();
</script>

<style scoped>
.producto-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.producto-card:hover {
  border-color: #E8913A;
  box-shadow: 0 2px 8px rgba(232, 145, 58, 0.15);
}

.producto-card.selected {
  border-color: #E8913A;
  background: #fef3e2;
  box-shadow: 0 0 0 2px rgba(232, 145, 58, 0.2);
}

.producto-card.agotado {
  opacity: 0.8;
}

.producto-imagen {
  width: 60px;
  height: 60px;
  min-width: 60px;
  border-radius: 6px;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.producto-imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-imagen {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #9ca3af;
  font-size: 24px;
}

.estado-badge {
  position: absolute;
  bottom: 4px;
  left: 4px;
  right: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
}

.estado-badge.agotado {
  background: #fee2e2;
  color: #dc2626;
}

.estado-badge.nuevo {
  background: #d1fae5;
  color: #059669;
}

.producto-info {
  flex: 1;
  min-width: 0;
}

.producto-nombre {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.producto-categoria {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.menu-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #9ca3af;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Dark Mode */
.dark .producto-card {
  background: #1f2937;
  border-color: #374151;
}

.dark .producto-card:hover {
  border-color: #f0a85a;
}

.dark .producto-card.selected {
  border-color: #f0a85a;
  background: #451a03;
}

.dark .producto-imagen {
  background: #374151;
}

.dark .placeholder-imagen {
  color: #6b7280;
}

.dark .producto-nombre {
  color: #f3f4f6;
}

.dark .producto-categoria {
  color: #9ca3af;
}

.dark .menu-btn {
  color: #6b7280;
}

.dark .menu-btn:hover {
  background: #374151;
  color: #f3f4f6;
}
</style>
