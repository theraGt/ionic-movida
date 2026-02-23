<template>
  <ion-page>
    <div class="dashboard-wrapper">
      <Sidebar />

      <div class="main-container">
        <Header />

        <ion-content>
          <main class="content-padding">
            <div class="page-title-row">
              <h1 class="page-title">Voluntarios</h1>
              <div class="actions-group">
                <ion-button fill="clear" color="medium">
                  <ion-icon slot="icon-only" :icon="filterOutline"></ion-icon>
                </ion-button>
                <ion-button fill="clear" color="medium">
                  <ion-icon slot="icon-only" :icon="downloadOutline"></ion-icon>
                </ion-button>
              </div>
            </div>

            <div class="dashboard-grid">
              <section class="voluntarios-section">
                <div class="card-container">
                  <header class="card-header">
                    <h2 class="card-title">Registro de Voluntarios</h2>
                    <div class="header-actions">
                      <ion-button size="small" @click="handleAdd" class="add-button">
                        <ion-icon slot="start" :icon="addOutline"></ion-icon>
                        Nuevo Voluntario
                      </ion-button>
                    </div>
                  </header>

                  <VoluntariosList
                    :voluntarios="voluntarios"
                    :loading="loading"
                    :selected-voluntario="selectedVoluntario"
                    @select="handleSelect"
                    @edit="handleEdit"
                    @delete="fetchVoluntarios"
                  />
                </div>
              </section>
            </div>
          </main>
        </ion-content>
      </div>

      <!-- Panel lateral de detalles -->
      <VoluntarioDetailPanel
        :is-open="isPanelOpen"
        :voluntario="selectedVoluntario"
        @close="closePanel"
        @edit="handleEditFromPanel"
        @delete="handleDeleteFromPanel"
      />

      <!-- Modal para editar/crear -->
      <VoluntarioModal
        :is-open="isModalOpen"
        :voluntario="selectedVoluntario"
        @close="closeModal"
        @save="handleSave"
      />
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonContent, IonButton, IonIcon, toastController } from '@ionic/vue';
import { addOutline, filterOutline, downloadOutline } from 'ionicons/icons';

// Layout & Componentes
import Sidebar from '@/components/Layout/Sidebar.vue';
import Header from '@/components/Layout/Header.vue';
import VoluntariosList from '@/components/voluntarios/VoluntariosList.vue';
import VoluntarioDetailPanel from '@/components/voluntarios/VoluntarioDetailPanel.vue';
import VoluntarioModal from '@/components/voluntarios/VoluntarioModal.vue';

// Lógica y Tipos
import { Voluntario } from '@/types/voluntario';
import { blink } from '@/lib/blink';

const voluntarios = ref<Voluntario[]>([]);
const loading = ref(true);
const isModalOpen = ref(false);
const isPanelOpen = ref(false);
const selectedVoluntario = ref<Voluntario | null>(null);

const fetchVoluntarios = async () => {
  try {
    loading.value = true;
    const data = await blink.db.voluntarios.list({
      orderBy: { fechaInscripcion: 'desc' },
    });
    voluntarios.value = data as Voluntario[];
  } catch (error) {
    console.error('Error:', error);
    // Datos de ejemplo para desarrollo
    voluntarios.value = [
      {
        id: 'Ecuad13076fe4',
        fechaInscripcion: '27/01/2025',
        horaInscripcion: '19:27:02',
        nombreCompleto: 'Juanita Judith Espinoza',
        pais: 'Ecuador',
        nacionalidad: 'Ecuador',
        documentoIdentificacion: '0921307831',
        fechaNacimiento: '21/01/1984',
        edad: 42,
        genero: 'Mujer',
        profesionOficio: 'Docencia',
        ocupacion: 'Trabajador',
        telefono: '593994007870',
        estadoCivil: 'Soltero(a)',
        departamentoRegion: 'Costa',
        municipioProvincia: 'Guayas',
        ciudad: 'Guayaquil',
        gradoAcademico: 'Universidad',
        estudiosAdicionales: 'Maestria',
        correo: 'joan_christ@hotmail.com',
        facebook: 'https://www.facebook.com/share/1YjkBEPSsV/',
        instagram: 'https://www.instagram.com/juanimusic_',
        tiktok: 'https://www.tiktok.com/@juanimusic_1',
        iglesia: 'La Luz de Dios',
        pastor: 'Marcos Cordova',
        contactoPastor: '593993221829',
        denominacion: 'Pentecostal',
        areasServicio: 'Misiones',
        donesTalentos: 'Musico',
        cursoStoryline: 'SI',
        diplomaStoryline: '',
        cursoVayaMovilizar: 'SI',
        diplomaVayaMovilizar: '',
        cimasAsistidos: 'CIMA 2024 El Legado - Ecuador',
        areasServicioCima: 'Logistica',
        programasParticipados: 'Cima, Cima Day, Sigue, Visita a iglesias',
        tipoVoluntariado: 'Voluntario',
        testimonio: '',
        cartaPastoral: '',
        foto: 'Voluntarios_Images/Ecuad13076fe4.FOTO.011510.jpg',
        datosCompletos: 'NO',
      },
      {
        id: 'Guate8620833b',
        fechaInscripcion: '03/03/2025',
        horaInscripcion: '8:01:35',
        nombreCompleto: 'Debora Dinora Tipol Dubon',
        pais: 'Guatemala',
        nacionalidad: 'Guatemala',
        documentoIdentificacion: '3268620721604',
        fechaNacimiento: '03/01/1999',
        edad: 27,
        genero: 'Mujer',
        profesionOficio: 'Maestra',
        ocupacion: 'Trabajador',
        telefono: '50249989952',
        estadoCivil: 'Soltero(a)',
        departamentoRegion: 'Alta Verapaz',
        municipioProvincia: 'Coban',
        ciudad: 'Coban',
        gradoAcademico: 'Universidad',
        estudiosAdicionales: '',
        correo: 'debora@example.com',
        facebook: '',
        instagram: '',
        tiktok: '',
        iglesia: 'Iglesia Asamblea de Dios "JOSUE"',
        pastor: 'Pastor Principal',
        contactoPastor: '50240000000',
        denominacion: 'Pentecostal',
        areasServicio: 'Logistica',
        donesTalentos: 'Servicio',
        cursoStoryline: 'SI',
        diplomaStoryline: '2025',
        cursoVayaMovilizar: 'SI',
        diplomaVayaMovilizar: '2025',
        cimasAsistidos: 'CIMA 2024 El Legado - Guatemala',
        areasServicioCima: 'Logistica',
        programasParticipados: 'Cima, Cima Day, Sigue',
        tipoVoluntariado: 'Voluntario',
        testimonio: 'Testimonio de la voluntaria...',
        cartaPastoral: 'Carta pastoral de respaldo...',
        foto: '',
        datosCompletos: 'SI',
      },
    ];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchVoluntarios();
});

const handleAdd = () => {
  selectedVoluntario.value = null;
  isModalOpen.value = true;
};

const handleSelect = (voluntario: Voluntario) => {
  selectedVoluntario.value = voluntario;
  isPanelOpen.value = true;
};

const handleEdit = (voluntario: Voluntario) => {
  selectedVoluntario.value = voluntario;
  isModalOpen.value = true;
};

const handleEditFromPanel = () => {
  isPanelOpen.value = false;
  isModalOpen.value = true;
};

const handleDeleteFromPanel = async () => {
  isPanelOpen.value = false;
  selectedVoluntario.value = null;
  await fetchVoluntarios();
};

const closePanel = () => {
  isPanelOpen.value = false;
  selectedVoluntario.value = null;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleSave = async () => {
  await fetchVoluntarios();
  isModalOpen.value = false;
};
</script>

<style scoped>
.dashboard-wrapper {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background-color: #f9fafb;
}

.content-padding {
  padding: 24px;
}

.page-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #111827;
}

.actions-group {
  display: flex;
  gap: 8px;
}

.dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: calc(100vh - 180px);
}

.voluntarios-section {
  width: 100%;
  height: 100%;
}

/* Card Styling */
.card-container {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.add-button {
  --background: #e8913a;
  --color: white;
  font-weight: 500;
  --border-radius: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .content-padding {
    padding: 16px;
  }

  .dashboard-wrapper {
    flex-direction: column;
  }

  .dashboard-grid {
    height: auto;
  }
}

/* Dark Mode */
.dark .main-container {
  background-color: #111827;
}

.dark .page-title {
  color: #f3f4f6;
}

.dark .card-container {
  background: #1f2937;
  border-color: #374151;
}

.dark .card-title {
  color: #f3f4f6;
}
</style>
