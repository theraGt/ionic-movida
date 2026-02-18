<template>
  <ion-page>
    <div class="layout-container">
      <Sidebar />
      
      <div class="main-content">
        <Header>
          <template #search>
            <div class="breadcrumb-search">
              <div class="breadcrumb">
                <span>Kiosco Movida</span>
                <ion-icon :icon="chevronForward" />
                <span class="current">Kiosco Online</span>
              </div>
              <div class="search-box">
                <ion-icon :icon="searchOutline" class="search-icon" />
                <input
                  type="text"
                  placeholder="Search Kiosco Online"
                  v-model="busqueda"
                />
              </div>
            </div>
          </template>
          <template #actions>
            <button class="btn-add" @click="agregarProducto">
              <ion-icon :icon="add" />
              <span>Add</span>
            </button>
            <button class="btn-filter" @click="mostrarFiltros = true">
              <ion-icon :icon="funnelOutline" />
            </button>
            <button class="btn-expand">
              <ion-icon :icon="expandOutline" />
            </button>
          </template>
        </Header>
        
        <div class="content-area">
          <KioscoSidebar
            :categorias="categorias"
            :selected-categoria="categoriaSeleccionada"
            @select="seleccionarCategoria"
          />
          
          <div class="content-wrapper">
            <KioscoProductGrid
              :productos="productosFiltrados"
              :selected-producto="productoSeleccionado"
              @select="seleccionarProducto"
              @menu="mostrarMenuProducto"
            />
          </div>
          
          <KioscoDetailPanel
            :producto="productoSeleccionado"
            @close="cerrarDetalle"
            @edit="editarProducto"
            v-if="productoSeleccionado"
          />
        </div>
      </div>
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IonPage, IonIcon } from '@ionic/vue';
import {
  chevronForward,
  searchOutline,
  add,
  funnelOutline,
  expandOutline
} from 'ionicons/icons';
import Sidebar from '@/components/Layout/Sidebar.vue';
import Header from '@/components/Layout/Header.vue';
import KioscoSidebar from '@/components/kiosco/KioscoSidebar.vue';
import KioscoProductGrid from '@/components/kiosco/KioscoProductGrid.vue';
import KioscoDetailPanel from '@/components/kiosco/KioscoDetailPanel.vue';
import type { Producto, Categoria } from '@/types/kiosco';

// Estado
const busqueda = ref('');
const categoriaSeleccionada = ref<string | null>(null);
const productoSeleccionado = ref<Producto | null>(null);
const mostrarFiltros = ref(false);

// Datos de ejemplo - Categorías
const categorias = ref<Categoria[]>([
  { id: 'agendas', nombre: 'Agendas', cantidad: 1 },
  { id: 'collares', nombre: 'Collares', cantidad: 1 },
  { id: 'gorras', nombre: 'Gorras', cantidad: 2 },
  { id: 'imanes', nombre: 'Imanes', cantidad: 1 },
  { id: 'lapiceros', nombre: 'Lapiceros', cantidad: 1 },
  { id: 'libros', nombre: 'Libros', cantidad: 30 },
  { id: 'llaveros', nombre: 'Llaveros', cantidad: 1 },
  { id: 'mochilas', nombre: 'Mochilas', cantidad: 1 },
  { id: 'pachones', nombre: 'Pachones', cantidad: 1 },
  { id: 'playeras', nombre: 'Playeras', cantidad: 61 },
  { id: 'porta-gafetes', nombre: 'Porta Gafetes', cantidad: 1 },
  { id: 'pulseras', nombre: 'Pulseras', cantidad: 1 },
  { id: 'stikers', nombre: 'Stikers', cantidad: 1 },
  { id: 'sueteres', nombre: 'Sueteres', cantidad: 8 },
  { id: 'tazas', nombre: 'Tazas', cantidad: 1 },
  { id: 'termos', nombre: 'Termos', cantidad: 2 },
  { id: 'toallas', nombre: 'Toallas', cantidad: 1 },
  { id: 'biblias', nombre: 'Biblias', cantidad: 1 },
  { id: 'collar', nombre: 'Collar', cantidad: 1 }
]);

// Datos de ejemplo - Productos
const productos = ref<Producto[]>([
  {
    id: 'c0364592',
    nombre: 'Libro "Dispersados"',
    categoria: 'Libros',
    categoriaId: 'libros',
    estado: 'agotado',
    precio: 0,
    costo: 0,
    cantidad: 0,
    venta: 0,
    ganancia: 0,
    talla: 'Libros',
    colores: ['#10b981', '#fbbf24', '#f97316', '#ef4444', '#a855f7', '#3b82f6', '#e5e7eb', '#374151'],
    foto: '',
    autor: 'Andrew Scott',
    paginas: 0
  },
  {
    id: 'c0364593',
    nombre: 'Libro "El Asesinato de cristianos"',
    categoria: 'Libros',
    categoriaId: 'libros',
    estado: 'disponible',
    precio: 150,
    costo: 100,
    cantidad: 5,
    venta: 150,
    ganancia: 50,
    talla: 'Libros',
    colores: ['#10b981', '#fbbf24', '#f97316', '#ef4444', '#a855f7', '#3b82f6', '#e5e7eb', '#374151'],
    autor: 'Autor Desconocido',
    paginas: 250
  },
  {
    id: 'c0364594',
    nombre: 'Libro "En medio del fuego"',
    categoria: 'Libros',
    categoriaId: 'libros',
    estado: 'disponible',
    precio: 120,
    costo: 80,
    cantidad: 8,
    venta: 120,
    ganancia: 40,
    talla: 'Libros',
    autor: 'John Smith',
    paginas: 180
  },
  {
    id: 'c0364595',
    nombre: 'Libro "Entre la Gracia y la verdad"',
    categoria: 'Libros',
    categoriaId: 'libros',
    estado: 'disponible',
    precio: 135,
    costo: 90,
    cantidad: 3,
    venta: 135,
    ganancia: 45,
    talla: 'Libros',
    autor: 'María García',
    paginas: 220
  },
  {
    id: 'c0364596',
    nombre: 'Libro "Explorer Movida ediciones"',
    categoria: 'Libros',
    categoriaId: 'libros',
    estado: 'disponible',
    precio: 200,
    costo: 140,
    cantidad: 10,
    venta: 200,
    ganancia: 60,
    talla: 'Libros',
    autor: 'Movida Team',
    paginas: 300
  },
  {
    id: 'c0364597',
    nombre: 'Libro "Liderazgo espiritual"',
    categoria: 'Libros',
    categoriaId: 'libros',
    estado: 'disponible',
    precio: 175,
    costo: 120,
    cantidad: 6,
    venta: 175,
    ganancia: 55,
    talla: 'Libros',
    autor: 'Peter Johnson',
    paginas: 280
  },
  {
    id: 'c0364598',
    nombre: 'Libro "Verdadera Valentia"',
    categoria: 'Libros',
    categoriaId: 'libros',
    estado: 'disponible',
    precio: 145,
    costo: 95,
    cantidad: 4,
    venta: 145,
    ganancia: 50,
    talla: 'Libros',
    autor: 'Sarah Wilson',
    paginas: 200
  },
  {
    id: 'a001',
    nombre: 'Agenda 2025',
    categoria: 'Agenda',
    categoriaId: 'agendas',
    estado: 'disponible',
    precio: 85,
    costo: 50,
    cantidad: 15,
    venta: 85,
    ganancia: 35,
    talla: 'Única'
  },
  {
    id: 'b001',
    nombre: 'Biblia de Estudio',
    categoria: 'Biblia',
    categoriaId: 'biblias',
    estado: 'disponible',
    precio: 350,
    costo: 250,
    cantidad: 8,
    venta: 350,
    ganancia: 100,
    talla: 'Grande'
  },
  {
    id: 'c001',
    nombre: 'Collar Cruz',
    categoria: 'Collar',
    categoriaId: 'collar',
    estado: 'disponible',
    precio: 120,
    costo: 70,
    cantidad: 12,
    venta: 120,
    ganancia: 50,
    talla: 'Única'
  }
]);

// Computed
const productosFiltrados = computed(() => {
  let resultado = productos.value;
  
  // Filtrar por categoría
  if (categoriaSeleccionada.value) {
    resultado = resultado.filter(p => p.categoriaId === categoriaSeleccionada.value);
  }
  
  // Filtrar por búsqueda
  if (busqueda.value) {
    const termino = busqueda.value.toLowerCase();
    resultado = resultado.filter(p => 
      p.nombre.toLowerCase().includes(termino) ||
      p.categoria.toLowerCase().includes(termino)
    );
  }
  
  return resultado;
});

// Métodos
const seleccionarCategoria = (categoriaId: string | null) => {
  categoriaSeleccionada.value = categoriaId;
};

const seleccionarProducto = (producto: Producto) => {
  productoSeleccionado.value = producto;
};

const cerrarDetalle = () => {
  productoSeleccionado.value = null;
};

const mostrarMenuProducto = (producto: Producto) => {
  // Aquí se puede implementar un action sheet o modal de opciones
  console.log('Menu para producto:', producto);
};

const agregarProducto = () => {
  // Aquí se puede abrir un modal para agregar producto
  console.log('Agregar nuevo producto');
};

const editarProducto = () => {
  // Aquí se puede abrir un modal para editar el producto seleccionado
  console.log('Editar producto:', productoSeleccionado.value);
};
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  background: #f9fafb;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.breadcrumb-search {
  display: flex;
  align-items: center;
  gap: 24px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
}

.breadcrumb .current {
  color: #111827;
  font-weight: 500;
}

.breadcrumb ion-icon {
  font-size: 14px;
  color: #9ca3af;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  min-width: 300px;
}

.search-box input {
  background: none;
  border: none;
  color: white;
  font-size: 14px;
  outline: none;
  width: 100%;
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-icon {
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #d4a574;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-add:hover {
  background: #c49a6c;
}

.btn-filter,
.btn-expand {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.btn-filter:hover,
.btn-expand:hover {
  background: rgba(255, 255, 255, 0.3);
}

.content-area {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f9fafb;
}
</style>
