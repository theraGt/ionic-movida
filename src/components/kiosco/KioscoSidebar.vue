<template>
  <div class="kiosco-sidebar">
    <div class="categoria-item all" :class="{ active: selectedCategoria === null }" @click="selectCategoria(null)">
      <span class="nombre">All</span>
    </div>
    
    <div
      v-for="categoria in categorias"
      :key="categoria.id"
      class="categoria-item"
      :class="{ active: selectedCategoria === categoria.id }"
      @click="selectCategoria(categoria.id)"
    >
      <span class="nombre">{{ categoria.nombre }}</span>
      <span class="cantidad">{{ categoria.cantidad }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Categoria } from '@/types/kiosco';

interface Props {
  categorias: Categoria[];
  selectedCategoria: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'select', categoriaId: string | null): void;
}>();

const selectCategoria = (categoriaId: string | null) => {
  emit('select', categoriaId);
};
</script>

<style scoped>
.kiosco-sidebar {
  width: 180px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  height: 100%;
  overflow-y: auto;
  padding: 8px 0;
}

.categoria-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.categoria-item:hover {
  background: #f9fafb;
}

.categoria-item.active {
  background: #fef3e2;
  border-left-color: #E8913A;
}

.categoria-item.all {
  margin-bottom: 8px;
  border-radius: 0 20px 20px 0;
  margin-right: 8px;
  background: #f3f4f6;
}

.categoria-item.all.active {
  background: #fef3e2;
}

.nombre {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.categoria-item.active .nombre {
  color: #E8913A;
  font-weight: 600;
}

.cantidad {
  font-size: 12px;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 12px;
  min-width: 24px;
  text-align: center;
}

.categoria-item.active .cantidad {
  background: #E8913A;
  color: white;
}

/* Dark Mode */
.dark .kiosco-sidebar {
  background: #1f2937;
  border-right-color: #374151;
}

.dark .categoria-item:hover {
  background: #374151;
}

.dark .categoria-item.active {
  background: #451a03;
}

.dark .categoria-item.all {
  background: #374151;
}

.dark .categoria-item.all.active {
  background: #451a03;
}

.dark .nombre {
  color: #d1d5db;
}

.dark .categoria-item.active .nombre {
  color: #f0a85a;
}

.dark .cantidad {
  background: #374151;
  color: #9ca3af;
}

.dark .categoria-item.active .cantidad {
  background: #f0a85a;
  color: #1f2937;
}
</style>
