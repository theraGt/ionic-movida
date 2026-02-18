<template>
  <div class="product-grid">
    <div v-for="grupo in productosAgrupados" :key="grupo.categoriaId" class="categoria-grupo">
      <div class="categoria-header">
        <h3 class="categoria-nombre">{{ grupo.categoriaNombre }}</h3>
        <span class="categoria-cantidad">{{ grupo.productos.length }}</span>
      </div>
      
      <div class="productos-grid">
        <KioscoProductCard
          v-for="producto in grupo.productos"
          :key="producto.id"
          :producto="producto"
          :is-selected="selectedProducto?.id === producto.id"
          @select="$emit('select', producto)"
          @menu="$emit('menu', producto)"
        />
      </div>
    </div>
    
    <div v-if="productosAgrupados.length === 0" class="empty-state">
      <ion-icon :icon="cubeOutline" class="empty-icon" />
      <p>No hay productos en esta categoría</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonIcon } from '@ionic/vue';
import { cubeOutline } from 'ionicons/icons';
import KioscoProductCard from './KioscoProductCard.vue';
import type { Producto } from '@/types/kiosco';

interface Props {
  productos: Producto[];
  selectedProducto: Producto | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'select', producto: Producto): void;
  (e: 'menu', producto: Producto): void;
}>();

interface GrupoProductos {
  categoriaId: string;
  categoriaNombre: string;
  productos: Producto[];
}

const productosAgrupados = computed<GrupoProductos[]>(() => {
  const grupos: Record<string, GrupoProductos> = {};
  
  props.productos.forEach(producto => {
    if (!grupos[producto.categoriaId]) {
      grupos[producto.categoriaId] = {
        categoriaId: producto.categoriaId,
        categoriaNombre: producto.categoria,
        productos: []
      };
    }
    grupos[producto.categoriaId].productos.push(producto);
  });
  
  return Object.values(grupos);
});
</script>

<style scoped>
.product-grid {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f9fafb;
}

.categoria-grupo {
  margin-bottom: 24px;
}

.categoria-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.categoria-nombre {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.categoria-cantidad {
  font-size: 12px;
  color: #6b7280;
  background: #e5e7eb;
  padding: 2px 8px;
  border-radius: 12px;
  min-width: 24px;
  text-align: center;
}

.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: #9ca3af;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}
</style>
