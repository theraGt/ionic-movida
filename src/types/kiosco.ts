export interface Categoria {
  id: string;
  nombre: string;
  cantidad: number;
  icono?: string;
}

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  categoriaId: string;
  estado: 'disponible' | 'agotado' | 'nuevo';
  precio: number;
  costo: number;
  cantidad: number;
  venta: number;
  ganancia: number;
  talla?: string;
  color?: string;
  colores?: string[];
  foto?: string;
  autor?: string;
  paginas?: number;
  descripcion?: string;
}

export interface KioscoState {
  categoriaSeleccionada: string | null;
  productoSeleccionado: Producto | null;
  busqueda: string;
}
