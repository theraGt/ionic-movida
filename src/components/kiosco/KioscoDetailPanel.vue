<template>
  <div class="detail-panel" v-if="producto">
    <!-- Header del panel -->
    <div class="panel-header">
      <div class="header-actions">
        <button class="action-btn" title="Copiar">
          <ion-icon :icon="copyOutline" />
        </button>
        <button class="action-btn" title="Eliminar">
          <ion-icon :icon="trashOutline" />
        </button>
        <button class="action-btn edit" title="Editar">
          <ion-icon :icon="createOutline" />
          <span>Edit</span>
        </button>
        <button class="action-btn" title="Anterior">
          <ion-icon :icon="chevronBack" />
        </button>
        <button class="action-btn" title="Siguiente">
          <ion-icon :icon="chevronForward" />
        </button>
        <button class="action-btn" title="Expandir">
          <ion-icon :icon="expandOutline" />
        </button>
        <button class="action-btn close" @click="$emit('close')">
          <ion-icon :icon="closeOutline" />
        </button>
      </div>
    </div>

    <!-- Imagen del producto -->
    <div class="producto-imagen-container">
      <div class="imagen-wrapper">
        <img v-if="producto.foto" :src="producto.foto" :alt="producto.nombre" />
        <div v-else class="placeholder-imagen">
          <ion-icon :icon="imageOutline" />
        </div>
      </div>
    </div>

    <!-- Info básica -->
    <div class="producto-header-info">
      <h2 class="producto-titulo">{{ producto.nombre }}</h2>
      <span class="producto-estado" :class="producto.estado">{{ producto.estado }}</span>
    </div>

    <!-- Acciones del producto -->
    <div class="producto-actions">
      <span class="badge nuevo" v-if="producto.estado === 'nuevo'">NEW PRODUCT</span>
      <button class="btn-editar-texto" @click="$emit('edit')">EDIT</button>
      <button class="action-btn-icon" title="Eliminar">
        <ion-icon :icon="trashOutline" />
      </button>
      <button class="action-btn-icon" title="Compartir">
        <ion-icon :icon="shareOutline" />
      </button>
    </div>

    <!-- Detalles del producto -->
    <div class="producto-detalles">
      <div class="detalle-row">
        <span class="detalle-label">ID</span>
        <span class="detalle-value">{{ producto.id }}</span>
      </div>

      <div class="detalle-row" v-if="producto.talla">
        <span class="detalle-label">TALLA</span>
        <span class="detalle-value">{{ producto.talla }}</span>
      </div>

      <div class="detalle-row" v-if="producto.colores && producto.colores.length > 0">
        <span class="detalle-label">COLOR</span>
        <div class="colores-container">
          <span
            v-for="(color, index) in producto.colores"
            :key="index"
            class="color-circle"
            :style="{ backgroundColor: color }"
            :class="{ selected: index === 0 }"
          />
        </div>
      </div>

      <div class="detalle-row">
        <span class="detalle-label">PRECIO</span>
        <div class="input-con-botones">
          <span class="moneda">Q</span>
          <input type="number" v-model="precioLocal" class="detalle-input" />
          <button class="btn-cantidad" @click="decrementarPrecio">−</button>
          <button class="btn-cantidad" @click="incrementarPrecio">+</button>
        </div>
      </div>

      <div class="detalle-row">
        <span class="detalle-label">CANTIDAD</span>
        <div class="input-con-botones">
          <input type="number" v-model="cantidadLocal" class="detalle-input" />
          <button class="btn-cantidad" @click="decrementarCantidad">−</button>
          <button class="btn-cantidad" @click="incrementarCantidad">+</button>
        </div>
      </div>

      <div class="detalle-row">
        <span class="detalle-label">COSTO</span>
        <span class="detalle-value precio">Q{{ formatoPrecio(producto.costo) }}</span>
      </div>

      <div class="detalle-row">
        <span class="detalle-label">VENTA*</span>
        <div class="input-con-botones">
          <span class="moneda">Q</span>
          <input type="number" v-model="ventaLocal" class="detalle-input" />
          <button class="btn-cantidad" @click="decrementarVenta">−</button>
          <button class="btn-cantidad" @click="incrementarVenta">+</button>
        </div>
      </div>

      <div class="detalle-row">
        <span class="detalle-label">GANANCIA</span>
        <span class="detalle-value precio">Q{{ formatoPrecio(producto.ganancia) }}</span>
      </div>

      <div class="detalle-row" v-if="producto.foto">
        <span class="detalle-label">FOTO</span>
        <div class="foto-preview">
          <img :src="producto.foto" :alt="producto.nombre" />
        </div>
      </div>

      <div class="detalle-row" v-if="producto.autor">
        <span class="detalle-label">Autor</span>
        <span class="detalle-value">{{ producto.autor }}</span>
      </div>

      <div class="detalle-row" v-if="producto.paginas !== undefined">
        <span class="detalle-label">Paginas</span>
        <span class="detalle-value">{{ producto.paginas }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { IonIcon } from '@ionic/vue';
import {
  copyOutline,
  trashOutline,
  createOutline,
  chevronBack,
  chevronForward,
  expandOutline,
  closeOutline,
  imageOutline,
  shareOutline
} from 'ionicons/icons';
import type { Producto } from '@/types/kiosco';

interface Props {
  producto: Producto | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'edit'): void;
  (e: 'update', producto: Producto): void;
}>();

const precioLocal = ref(0);
const cantidadLocal = ref(0);
const ventaLocal = ref(0);

watch(() => props.producto, (newProducto) => {
  if (newProducto) {
    precioLocal.value = newProducto.precio;
    cantidadLocal.value = newProducto.cantidad;
    ventaLocal.value = newProducto.venta;
  }
}, { immediate: true });

const formatoPrecio = (precio: number): string => {
  return precio.toFixed(2).replace('.', ',');
};

const incrementarPrecio = () => {
  precioLocal.value++;
};

const decrementarPrecio = () => {
  if (precioLocal.value > 0) precioLocal.value--;
};

const incrementarCantidad = () => {
  cantidadLocal.value++;
};

const decrementarCantidad = () => {
  if (cantidadLocal.value > 0) cantidadLocal.value--;
};

const incrementarVenta = () => {
  ventaLocal.value++;
};

const decrementarVenta = () => {
  if (ventaLocal.value > 0) ventaLocal.value--;
};
</script>

<style scoped>
.detail-panel {
  width: 380px;
  background: #ffffff;
  border-left: 1px solid #e5e7eb;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-btn {
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: #6b7280;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.action-btn.edit {
  background: #d4a574;
  color: white;
  padding: 6px 12px;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
}

.action-btn.edit:hover {
  background: #c49a6c;
}

.action-btn.close:hover {
  background: #fee2e2;
  color: #dc2626;
}

.producto-imagen-container {
  padding: 24px;
  display: flex;
  justify-content: center;
  background: #fafafa;
}

.imagen-wrapper {
  width: 200px;
  height: 200px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.imagen-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.placeholder-imagen {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #d1d5db;
  font-size: 64px;
}

.producto-header-info {
  padding: 16px 24px;
  text-align: center;
}

.producto-titulo {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.producto-estado {
  font-size: 12px;
  color: #6b7280;
  text-transform: capitalize;
}

.producto-estado.agotado {
  color: #dc2626;
}

.producto-estado.nuevo {
  color: #059669;
}

.producto-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 24px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.badge.nuevo {
  font-size: 11px;
  font-weight: 600;
  color: #d4a574;
  letter-spacing: 0.5px;
}

.btn-editar-texto {
  background: none;
  border: none;
  color: #d4a574;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  letter-spacing: 0.5px;
}

.btn-editar-texto:hover {
  background: #fef3e2;
  border-radius: 4px;
}

.action-btn-icon {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn-icon:hover {
  color: #6b7280;
}

.producto-detalles {
  padding: 16px 24px;
  flex: 1;
}

.detalle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detalle-label {
  font-size: 12px;
  font-weight: 500;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detalle-value {
  font-size: 14px;
  color: #111827;
  font-weight: 500;
}

.detalle-value.precio {
  color: #111827;
}

.colores-container {
  display: flex;
  gap: 8px;
}

.color-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  position: relative;
}

.color-circle.selected {
  border-color: #111827;
}

.color-circle.selected::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: translate(-50%, -60%) rotate(45deg);
}

.input-con-botones {
  display: flex;
  align-items: center;
  gap: 8px;
}

.moneda {
  font-size: 14px;
  color: #6b7280;
}

.detalle-input {
  width: 80px;
  padding: 6px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 14px;
  text-align: right;
  color: #111827;
}

.detalle-input:focus {
  outline: none;
  border-color: #E8913A;
}

.btn-cantidad {
  width: 28px;
  height: 28px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 16px;
  font-weight: 500;
}

.btn-cantidad:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.foto-preview {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  background: #f3f4f6;
}

.foto-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
