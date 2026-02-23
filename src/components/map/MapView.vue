<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Style, Circle, Fill, Stroke } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { MapLocation } from '../../types/map';

const props = defineProps<{
  locations: MapLocation[];
  center?: [number, number];
  zoom?: number;
}>();

const emit = defineEmits(['select-location']);

const mapContainer = ref<HTMLDivElement | null>(null);
let map: Map | null = null;
let vectorLayer: VectorLayer<VectorSource> | null = null;

// Crear estilos para diferentes tipos de ubicaciones
const getMarkerStyle = (tipo: string) => {
  const colors: Record<string, string> = {
    'actividad': '#3b82f6',
    'visita': '#10b981',
    'voluntario': '#f59e0b',
    'mision': '#8b5cf6'
  };

  const color = colors[tipo] || '#E8913A';

  return new Style({
    image: new Circle({
      radius: 10,
      fill: new Fill({ color: color }),
      stroke: new Stroke({
        color: '#ffffff',
        width: 3
      })
    })
  });
};

const getSelectedStyle = () => {
  return new Style({
    image: new Circle({
      radius: 14,
      fill: new Fill({ color: '#E8913A' }),
      stroke: new Stroke({
        color: '#ffffff',
        width: 4
      })
    })
  });
};

const initMap = () => {
  if (!mapContainer.value) return;

  // Centro por defecto: Ciudad de Guatemala
  const defaultCenter = props.center ? fromLonLat(props.center) : fromLonLat([-90.5069, 14.6349]);
  const defaultZoom = props.zoom || 12;

  // Crear capa vectorial para marcadores
  const vectorSource = new VectorSource();
  vectorLayer = new VectorLayer({
    source: vectorSource
  });

  // Crear el mapa
  map = new Map({
    target: mapContainer.value,
    layers: [
      new TileLayer({
        source: new OSM({
          attributions: '© OpenStreetMap contributors'
        })
      }),
      vectorLayer
    ],
    view: new View({
      center: defaultCenter,
      zoom: defaultZoom,
      maxZoom: 19,
      minZoom: 3
    }),
    controls: [] // Ocultar controles por defecto para diseño limpio
  });

  // Agregar marcadores
  updateMarkers();

  // Evento de clic en marcadores
  map.on('click', (event) => {
    const feature = map?.forEachFeatureAtPixel(event.pixel, (feat) => feat);
    if (feature) {
      const locationId = feature.get('locationId');
      const location = props.locations.find(l => l.id === locationId);
      if (location) {
        emit('select-location', location);
      }
    }
  });

  // Cambiar cursor al pasar sobre marcadores
  map.on('pointermove', (event) => {
    const pixel = map?.getEventPixel(event.originalEvent);
    const hit = map?.hasFeatureAtPixel(pixel || [0, 0]);
    if (mapContainer.value) {
      mapContainer.value.style.cursor = hit ? 'pointer' : '';
    }
  });
};

const updateMarkers = () => {
  if (!vectorLayer) return;

  const vectorSource = vectorLayer.getSource();
  if (!vectorSource) return;

  // Limpiar marcadores existentes
  vectorSource.clear();

  // Agregar nuevos marcadores
  props.locations.forEach((location) => {
    if (location.latitud && location.longitud) {
      const feature = new Feature({
        geometry: new Point(fromLonLat([location.longitud, location.latitud])),
        locationId: location.id
      });

      feature.setStyle(getMarkerStyle(location.tipo));
      vectorSource.addFeature(feature);
    }
  });
};

// Watch para actualizar marcadores cuando cambien las ubicaciones
watch(() => props.locations, () => {
  updateMarkers();
}, { deep: true });

// Watch para centrar el mapa
watch(() => props.center, (newCenter) => {
  if (map && newCenter) {
    map.getView().setCenter(fromLonLat(newCenter));
  }
}, { deep: true });

// Watch para cambiar zoom
watch(() => props.zoom, (newZoom) => {
  if (map && newZoom) {
    map.getView().setZoom(newZoom);
  }
});

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  if (map) {
    map.setTarget(undefined);
    map = null;
  }
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;

  border-radius: 12px;
  overflow: hidden;
}

:deep(.ol-control) {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 4px;
}

:deep(.ol-control button) {
  background: #ffffff;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin: 2px;
  width: 32px;
  height: 32px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
}

:deep(.ol-control button:hover) {
  background: #f9fafb;
  border-color: #E8913A;
  color: #E8913A;
}

:deep(.ol-attribution) {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px 0 0 0;
  padding: 4px 8px;
  font-size: 11px;
}

:deep(.ol-attribution a) {
  color: #6b7280;
  text-decoration: none;
}

/* Dark Mode */
.dark :deep(.ol-control) {
  background: rgba(31, 41, 55, 0.9);
  border: 1px solid #374151;
}

.dark :deep(.ol-control button) {
  background: #1f2937;
  color: #d1d5db;
  border-color: #374151;
}

.dark :deep(.ol-control button:hover) {
  background: #374151;
}

.dark :deep(.ol-attribution) {
  background: rgba(31, 41, 55, 0.9);
}

.dark :deep(.ol-attribution a) {
  color: #9ca3af;
}
</style>
