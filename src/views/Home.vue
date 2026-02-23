<template>
    <ion-page>
        <div class="dashboard-wrapper">
            <Sidebar />

            <div class="main-container">
                <Header />

                <ion-content>
                    <main class="content-padding">
                        <div class="page-title-row">
                            <h1 class="page-title">Dashboard</h1>
                            <div class="actions-group">
                                <ion-button fill="clear" color="medium" @click="fetchDashboardData">
                                    <ion-icon slot="icon-only" :icon="refreshOutline"></ion-icon>
                                </ion-button>
                            </div>
                        </div>

                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-icon bg-blue">
                                    <ion-icon :icon="calendarOutline"></ion-icon>
                                </div>
                                <div class="stat-content">
                                    <h3 class="stat-value">{{ activitiesCount }}</h3>
                                    <p class="stat-label">Actividades</p>
                                </div>
                                <div class="stat-trend positive" v-if="activitiesTrend > 0">
                                    <ion-icon :icon="trendingUpOutline"></ion-icon>
                                    <span>+{{ activitiesTrend }}%</span>
                                </div>
                            </div>

                            <div class="stat-card">
                                <div class="stat-icon bg-green">
                                    <ion-icon :icon="locationOutline"></ion-icon>
                                </div>
                                <div class="stat-content">
                                    <h3 class="stat-value">{{ visitasCount }}</h3>
                                    <p class="stat-label">Visitas</p>
                                </div>
                                <div class="stat-trend positive" v-if="visitasTrend > 0">
                                    <ion-icon :icon="trendingUpOutline"></ion-icon>
                                    <span>+{{ visitasTrend }}%</span>
                                </div>
                            </div>

                            <div class="stat-card">
                                <div class="stat-icon bg-amber">
                                    <ion-icon :icon="peopleOutline"></ion-icon>
                                </div>
                                <div class="stat-content">
                                    <h3 class="stat-value">{{ voluntariosCount }}</h3>
                                    <p class="stat-label">Voluntarios</p>
                                </div>
                                <div class="stat-trend positive" v-if="voluntariosTrend > 0">
                                    <ion-icon :icon="trendingUpOutline"></ion-icon>
                                    <span>+{{ voluntariosTrend }}%</span>
                                </div>
                            </div>

                            <div class="stat-card">
                                <div class="stat-icon bg-purple">
                                    <ion-icon :icon="globeOutline"></ion-icon>
                                </div>
                                <div class="stat-content">
                                    <h3 class="stat-value">{{ paisesCount }}</h3>
                                    <p class="stat-label">Países</p>
                                </div>
                            </div>
                        </div>

                        <div class="charts-grid">
                            <div class="chart-card">
                                <div class="chart-header">
                                    <h2 class="chart-title">Actividades por Mes</h2>
                                    <div class="chart-period">
                                        <span class="period-badge" :class="{ active: chartPeriod === '6m' }" @click="chartPeriod = '6m'">6M</span>
                                        <span class="period-badge" :class="{ active: chartPeriod === '12m' }" @click="chartPeriod = '12m'">12M</span>
                                    </div>
                                </div>
                                <div class="chart-container">
                                    <div class="bar-chart">
                                        <div class="chart-grid">
                                            <div v-for="(item, index) in activitiesByMonth" :key="index" class="chart-bar" :style="{ height: item.percentage + '%' }">
                                                <div class="bar-fill" :style="{ background: item.color }"></div>
                                                <span class="bar-value">{{ item.count }}</span>
                                            </div>
                                        </div>
                                        <div class="chart-labels">
                                            <span v-for="(item, index) in activitiesByMonth" :key="index">{{ item.month }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="chart-card">
                                <div class="chart-header">
                                    <h2 class="chart-title">Visitas por País</h2>
                                </div>
                                <div class="chart-container">
                                    <div class="pie-chart-wrapper">
                                        <div class="pie-chart" :style="pieChartStyle">
                                            <div class="pie-segment" v-for="(segment, index) in visitsByCountry" :key="index" :style="segment.style"></div>
                                            <div class="pie-center">
                                                <span class="pie-total">{{ visitasCount }}</span>
                                                <span class="pie-label">Total</span>
                                            </div>
                                        </div>
                                        <div class="pie-legend">
                                            <div v-for="(item, index) in visitsByCountry" :key="index" class="legend-item">
                                                <div class="legend-color" :style="{ background: item.color }"></div>
                                                <span class="legend-label">{{ item.country }}</span>
                                                <span class="legend-value">{{ item.percentage }}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="chart-card">
                                <div class="chart-header">
                                    <h2 class="chart-title">Voluntarios por País</h2>
                                </div>
                                <div class="chart-container">
                                    <div class="donut-chart-wrapper">
                                        <div class="donut-chart">
                                            <div class="donut-segment" v-for="(segment, index) in voluntariosByCountry" :key="index" :style="segment.style"></div>
                                            <div class="donut-center">
                                                <span class="donut-total">{{ voluntariosCount }}</span>
                                                <span class="donut-label">Total</span>
                                            </div>
                                        </div>
                                        <div class="donut-legend">
                                            <div v-for="(item, index) in voluntariosByCountry" :key="index" class="legend-item">
                                                <div class="legend-color" :style="{ background: item.color }"></div>
                                                <span class="legend-label">{{ item.country }}</span>
                                                <span class="legend-value">{{ item.count }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="chart-card">
                                <div class="chart-header">
                                    <h2 class="chart-title">Estado de Actividades</h2>
                                </div>
                                <div class="chart-container">
                                    <div class="status-chart">
                                        <div v-for="(item, index) in activitiesByStatus" :key="index" class="status-row">
                                            <div class="status-info">
                                                <div class="status-dot" :style="{ background: item.color }"></div>
                                                <span class="status-label">{{ item.status }}</span>
                                            </div>
                                            <div class="status-bar-container">
                                                <div class="status-bar" :style="{ width: item.percentage + '%', background: item.color }"></div>
                                            </div>
                                            <span class="status-count">{{ item.count }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="content-grid">
                            <div class="recent-activities">
                                <div class="card-container">
                                    <div class="card-header">
                                        <h2 class="card-title">
                                            <ion-icon :icon="calendarOutline" class="card-icon"></ion-icon>
                                            Actividades Recientes
                                        </h2>
                                        <ion-button fill="clear" size="small" @click="navigateTo('/activities')">
                                            Ver todas
                                            <ion-icon slot="end" :icon="chevronForwardOutline"></ion-icon>
                                        </ion-button>
                                    </div>
                                    <div class="items-list">
                                        <div v-for="activity in recentActivities" :key="activity.id" class="clickable-item" @click="openActivityPanel(activity)">
                                            <div class="item-icon" :class="getActivityTypeClass(activity.tipo)">
                                                <ion-icon :icon="getActivityIcon(activity.tipo)"></ion-icon>
                                            </div>
                                            <div class="item-details">
                                                <h3 class="item-title">{{ activity.actividad }}</h3>
                                                <p class="item-meta">
                                                    <span class="meta-date">{{ formatDate(activity.fecha) }}</span>
                                                    <span class="meta-divider">•</span>
                                                    <span class="meta-type">{{ activity.tipo }}</span>
                                                </p>
                                            </div>
                                            <div class="item-status" :class="activity.estado.toLowerCase()">
                                                {{ activity.estado }}
                                            </div>
                                            <ion-icon :icon="chevronForwardOutline" class="item-arrow"></ion-icon>
                                        </div>
                                        <div v-if="recentActivities.length === 0" class="empty-state">
                                            <ion-icon :icon="calendarOutline" class="empty-icon"></ion-icon>
                                            <p>No hay actividades recientes</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="recent-volunteers">
                                <div class="card-container">
                                    <div class="card-header">
                                        <h2 class="card-title">
                                            <ion-icon :icon="peopleOutline" class="card-icon"></ion-icon>
                                            Voluntarios Recientes
                                        </h2>
                                        <ion-button fill="clear" size="small" @click="navigateTo('/voluntarios')">
                                            Ver todos
                                            <ion-icon slot="end" :icon="chevronForwardOutline"></ion-icon>
                                        </ion-button>
                                    </div>
                                    <div class="items-list">
                                        <div v-for="voluntario in recentVoluntarios" :key="voluntario.id" class="clickable-item" @click="openVoluntarioPanel(voluntario)">
                                            <div class="item-avatar">
                                                <ion-icon :icon="personCircleOutline"></ion-icon>
                                            </div>
                                            <div class="item-details">
                                                <h3 class="item-title">{{ voluntario.nombreCompleto }}</h3>
                                                <p class="item-meta">
                                                    <span class="meta-country">
                                                        <ion-icon :icon="flagOutline"></ion-icon>
                                                        {{ voluntario.pais }}
                                                    </span>
                                                    <span class="meta-divider">•</span>
                                                    <span class="meta-date">{{ formatDate(voluntario.fechaInscripcion) }}</span>
                                                </p>
                                            </div>
                                            <div class="item-badge" v-if="voluntario.datosCompletos === 'SI'">
                                                <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
                                                Completo
                                            </div>
                                            <ion-icon :icon="chevronForwardOutline" class="item-arrow"></ion-icon>
                                        </div>
                                        <div v-if="recentVoluntarios.length === 0" class="empty-state">
                                            <ion-icon :icon="peopleOutline" class="empty-icon"></ion-icon>
                                            <p>No hay voluntarios registrados</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="recent-visits-section">
                            <div class="card-container">
                                <div class="card-header">
                                    <h2 class="card-title">
                                        <ion-icon :icon="locationOutline" class="card-icon"></ion-icon>
                                        Visitas Recientes
                                    </h2>
                                    <ion-button fill="clear" size="small" @click="navigateTo('/visitas')">
                                        Ver todas
                                        <ion-icon slot="end" :icon="chevronForwardOutline"></ion-icon>
                                    </ion-button>
                                </div>
                                <div class="visits-grid">
                                    <div v-for="visita in recentVisitas" :key="visita.id" class="visit-card clickable-item" @click="openVisitaPanel(visita)">
                                        <div class="visit-header">
                                            <span class="visit-type" :class="getTipoClass(visita.tipo)">{{ visita.tipo }}</span>
                                            <span class="visit-date">{{ formatDate(visita.inicio) }}</span>
                                        </div>
                                        <h3 class="visit-title">{{ visita.descripcion || 'Sin descripción' }}</h3>
                                        <div class="visit-meta">
                                            <span class="meta-item">
                                                <ion-icon :icon="personOutline"></ion-icon>
                                                {{ visita.encargado }}
                                            </span>
                                            <span class="meta-item">
                                                <ion-icon :icon="flagOutline"></ion-icon>
                                                {{ visita.pais }}
                                            </span>
                                        </div>
                                        <div class="visit-stats">
                                            <div class="stat-mini">
                                                <ion-icon :icon="peopleOutline"></ion-icon>
                                                <span>{{ visita.personasAlcanzadas }}</span>
                                            </div>
                                            <div class="stat-mini">
                                                <ion-icon :icon="cashOutline"></ion-icon>
                                                <span>Q{{ visita.totalInversion }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="recentVisitas.length === 0" class="empty-state full-width">
                                        <ion-icon :icon="locationOutline" class="empty-icon"></ion-icon>
                                        <p>No hay visitas registradas</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </ion-content>
            </div>

            <ActivityDetailPanel 
                :is-open="isActivityPanelOpen" 
                :activity="selectedActivity" 
                @close="closeActivityPanel"
                @edit="handleActivityEdit"
                @delete="handleActivityDelete"
            />

            <VoluntarioDetailPanel
                :is-open="isVoluntarioPanelOpen"
                :voluntario="selectedVoluntario"
                @close="closeVoluntarioPanel"
                @edit="handleVoluntarioEdit"
                @delete="handleVoluntarioDelete"
            />

            <VisitaDetailPanel
                :is-open="isVisitaPanelOpen"
                :visita="selectedVisita"
                @close="closeVisitaPanel"
                @edit="handleVisitaEdit"
                @delete="handleVisitaDelete"
            />
        </div>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
    IonPage,
    IonContent,
    IonButton,
    IonIcon
} from '@ionic/vue';
import {
    calendarOutline,
    locationOutline,
    peopleOutline,
    globeOutline,
    refreshOutline,
    trendingUpOutline,
    chevronForwardOutline,
    personCircleOutline,
    flagOutline,
    checkmarkCircleOutline,
    personOutline,
    cashOutline
} from 'ionicons/icons';

import Sidebar from '@/components/Layout/Sidebar.vue';
import Header from '@/components/Layout/Header.vue';
import ActivityDetailPanel from '@/components/activities/ActivityDetailPanel.vue';
import VoluntarioDetailPanel from '@/components/voluntarios/VoluntarioDetailPanel.vue';
import VisitaDetailPanel from '@/components/visitas/VisitaDetailPanel.vue';

import { Activity } from '@/types/activity';
import { Visita } from '@/types/visita';
import { Voluntario } from '@/types/voluntario';
import { blink } from '@/lib/blink';

const router = useRouter();

const activitiesCount = ref(0);
const visitasCount = ref(0);
const voluntariosCount = ref(0);
const paisesCount = ref(0);
const activitiesTrend = ref(0);
const visitasTrend = ref(0);
const voluntariosTrend = ref(0);

const recentActivities = ref<Activity[]>([]);
const recentVoluntarios = ref<Voluntario[]>([]);
const recentVisitas = ref<Visita[]>([]);

const chartPeriod = ref('6m');

const isActivityPanelOpen = ref(false);
const isVoluntarioPanelOpen = ref(false);
const isVisitaPanelOpen = ref(false);
const selectedActivity = ref<Activity | null>(null);
const selectedVoluntario = ref<Voluntario | null>(null);
const selectedVisita = ref<Visita | null>(null);

const allActivities = ref<Activity[]>([]);
const allVisitas = ref<Visita[]>([]);
const allVoluntarios = ref<Voluntario[]>([]);

const API_URL = 'https://thera-ia-api-movida-app.9zx1zd.easypanel.host';

const chartColors = ['#E8913A', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

const activitiesByMonth = computed(() => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentMonth = new Date().getMonth();
    const data: { month: string; count: number; percentage: number; color: string }[] = [];
    
    const monthsToShow = chartPeriod.value === '6m' ? 6 : 12;
    
    for (let i = monthsToShow - 1; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const count = allActivities.value.filter(a => {
            const actMonth = new Date(a.fecha).getMonth();
            return actMonth === monthIndex;
        }).length;
        
        data.push({
            month: months[monthIndex],
            count,
            percentage: 0,
            color: chartColors[monthIndex % chartColors.length]
        });
    }
    
    const maxCount = Math.max(...data.map(d => d.count), 1);
    data.forEach(d => {
        d.percentage = Math.max((d.count / maxCount) * 100, 10);
    });
    
    return data;
});

const visitsByCountry = computed(() => {
    const countryMap = new Map<string, number>();
    allVisitas.value.forEach(v => {
        const count = countryMap.get(v.pais) || 0;
        countryMap.set(v.pais, count + 1);
    });
    
    const total = Array.from(countryMap.values()).reduce((a, b) => a + b, 0);
    const data: { country: string; count: number; percentage: number; color: string; style: any }[] = [];
    let startAngle = -90;
    
    countryMap.forEach((count, country) => {
        const percentage = Math.round((count / total) * 100);
        const angle = (count / total) * 360;
        data.push({
            country,
            count,
            percentage,
            color: chartColors[data.length % chartColors.length],
            style: {
                background: `conic-gradient(${chartColors[data.length % chartColors.length]} ${startAngle}deg ${startAngle + angle}deg, transparent 0)`,
                clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)'
            }
        });
        startAngle += angle;
    });
    
    return data;
});

const pieChartStyle = computed(() => {
    const segments = visitsByCountry.value;
    if (segments.length === 0) return {};
    
    let gradient = '';
    let currentAngle = 0;
    
    segments.forEach((seg) => {
        const angle = (seg.count / visitasCount.value) * 360;
        gradient += `${seg.color} ${currentAngle}deg ${currentAngle + angle}deg, `;
        currentAngle += angle;
    });
    
    return {
        background: `conic-gradient(${gradient.slice(0, -2)})`
    };
});

const voluntariosByCountry = computed(() => {
    const countryMap = new Map<string, number>();
    allVoluntarios.value.forEach(v => {
        const count = countryMap.get(v.pais) || 0;
        countryMap.set(v.pais, count + 1);
    });
    
    const data: { country: string; count: number; percentage: number; color: string; style: any }[] = [];
    let startAngle = -90;
    const total = voluntariosCount.value || 1;
    
    countryMap.forEach((count, country) => {
        const percentage = Math.round((count / total) * 100);
        const angle = (count / total) * 360;
        
        data.push({
            country,
            count,
            percentage,
            color: chartColors[data.length % chartColors.length],
            style: {
                background: `conic-gradient(${chartColors[data.length % chartColors.length]} ${startAngle}deg ${startAngle + angle}deg, transparent 0)`,
                clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)'
            }
        });
        startAngle += angle;
    });
    
    return data;
});

const activitiesByStatus = computed(() => {
    const statusMap = new Map<string, number>();
    allActivities.value.forEach(a => {
        const count = statusMap.get(a.estado) || 0;
        statusMap.set(a.estado, count + 1);
    });
    
    const colors: Record<string, string> = {
        'Pendiente': '#f59e0b',
        'Completado': '#10b981',
        'Cancelado': '#ef4444'
    };
    
    const total = activitiesCount.value || 1;
    const data: { status: string; count: number; percentage: number; color: string }[] = [];
    
    statusMap.forEach((count, status) => {
        data.push({
            status,
            count,
            percentage: Math.round((count / total) * 100),
            color: colors[status] || '#6b7280'
        });
    });
    
    return data;
});

const fetchDashboardData = async () => {
    try {
        const [activitiesRes, visitasRes, voluntariosRes] = await Promise.all([
            fetch(`${API_URL}/activities`).catch(() => null),
            fetch(`${API_URL}/visitas`).catch(() => null),
            blink.db.voluntarios.list()
        ]);
        
        if (activitiesRes?.ok) {
            const activities = await activitiesRes.json();
            allActivities.value = activities;
            activitiesCount.value = activities.length;
            recentActivities.value = activities.slice(0, 5);
        } else {
            const mockActivities = await blink.db.activities.list({ orderBy: { fecha: 'desc' } });
            allActivities.value = mockActivities;
            activitiesCount.value = mockActivities.length;
            recentActivities.value = mockActivities.slice(0, 5);
        }
        
        if (visitasRes?.ok) {
            const visitas = await visitasRes.json();
            allVisitas.value = visitas;
            visitasCount.value = visitas.length;
            recentVisitas.value = visitas.slice(0, 4);
        } else {
            allVisitas.value = [];
            visitasCount.value = 0;
            recentVisitas.value = [];
        }
        
        allVoluntarios.value = voluntariosRes;
        voluntariosCount.value = voluntariosRes.length;
        recentVoluntarios.value = voluntariosRes.slice(0, 5);
        
        const allCountries = [
            ...allActivities.value.map((a: any) => a.pais),
            ...allVisitas.value.map((v: any) => v.pais),
            ...allVoluntarios.value.map((v: any) => v.pais)
        ];
        const uniqueCountries = new Set(allCountries.filter(Boolean));
        paisesCount.value = uniqueCountries.size;
        
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
};

const navigateTo = (path: string) => {
    router.push(path);
};

const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getActivityTypeClass = (tipo: string) => {
    const typeClasses: Record<string, string> = {
        'Personal': 'personal',
        'Reuniones': 'reuniones',
        'Misiones': 'misiones',
        'Misionero': 'misionero',
        'Devocionales': 'devocionales',
        'Cima': 'cima',
        'Voluntariado': 'voluntariado'
    };
    return typeClasses[tipo] || 'personal';
};

const getActivityIcon = (tipo: string) => {
    const icons: Record<string, any> = {
        'Personal': personOutline,
        'Reuniones': calendarOutline,
        'Misiones': globeOutline,
        'Misionero': peopleOutline,
        'Devocionales': calendarOutline,
        'Cima': calendarOutline,
        'Voluntariado': peopleOutline
    };
    return icons[tipo] || calendarOutline;
};

const getTipoClass = (tipo: string) => {
    const t = tipo?.toLowerCase();
    if (t === 'prisma') return 'tipo-prisma';
    if (t === 'visita') return 'tipo-visita';
    if (t === 'seguimiento') return 'tipo-seguimiento';
    return 'tipo-otro';
};

const openActivityPanel = (activity: Activity) => {
    selectedActivity.value = activity;
    isActivityPanelOpen.value = true;
};

const closeActivityPanel = () => {
    isActivityPanelOpen.value = false;
    selectedActivity.value = null;
};

const openVoluntarioPanel = (voluntario: Voluntario) => {
    selectedVoluntario.value = voluntario;
    isVoluntarioPanelOpen.value = true;
};

const closeVoluntarioPanel = () => {
    isVoluntarioPanelOpen.value = false;
    selectedVoluntario.value = null;
};

const openVisitaPanel = (visita: Visita) => {
    selectedVisita.value = visita;
    isVisitaPanelOpen.value = true;
};

const closeVisitaPanel = () => {
    isVisitaPanelOpen.value = false;
    selectedVisita.value = null;
};

const handleActivityEdit = (activity: Activity | null) => {
    if (activity) {
        closeActivityPanel();
        router.push('/activities');
    }
};

const handleActivityDelete = async (id: string | undefined) => {
    if (id) {
        try {
            await fetch(`${API_URL}/activities/${id}`, { method: 'DELETE' });
            await fetchDashboardData();
        } catch (error) {
            console.error('Error deleting activity:', error);
        }
    }
    closeActivityPanel();
};

const handleVoluntarioEdit = (voluntario: Voluntario | null) => {
    if (voluntario) {
        closeVoluntarioPanel();
        router.push('/voluntarios');
    }
};

const handleVoluntarioDelete = async (id: string | undefined) => {
    if (id) {
        try {
            await blink.db.voluntarios.delete(id);
            await fetchDashboardData();
        } catch (error) {
            console.error('Error deleting voluntario:', error);
        }
    }
    closeVoluntarioPanel();
};

const handleVisitaEdit = (visita: Visita | null) => {
    if (visita) {
        closeVisitaPanel();
        router.push('/visitas');
    }
};

const handleVisitaDelete = async (id: string | undefined) => {
    if (id) {
        try {
            await fetch(`${API_URL}/visitas/${id}`, { method: 'DELETE' });
            await fetchDashboardData();
        } catch (error) {
            console.error('Error deleting visita:', error);
        }
    }
    closeVisitaPanel();
};

onMounted(() => {
    fetchDashboardData();
});
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
    background-color: #f8fafc;
}

.content-padding {
    padding: 24px;
    overflow-y: auto;
    height: 100%;
}

.page-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.page-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    color: #1e293b;
}

.actions-group {
    display: flex;
    gap: 8px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
}

.stat-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    transition: all 0.2s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
}

.stat-icon.bg-blue {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #2563eb;
}

.stat-icon.bg-green {
    background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
    color: #16a34a;
}

.stat-icon.bg-amber {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #d97706;
}

.stat-icon.bg-purple {
    background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
    color: #9333ea;
}

.stat-icon ion-icon {
    font-size: 24px;
}

.stat-content {
    flex: 1;
}

.stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 0 4px 0;
    color: #1e293b;
}

.stat-label {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
}

.stat-trend {
    display: flex;
    align-items: center;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px;
}

.stat-trend.positive {
    background: #dcfce7;
    color: #16a34a;
}

.stat-trend ion-icon {
    font-size: 14px;
    margin-right: 4px;
}

.charts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 24px;
}

.chart-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0 0 0 0.04);
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.chart-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
}

.chart-period {
    display: flex;
    gap: 8px;
}

.period-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    background: #f1f5f9;
    cursor: pointer;
    transition: all 0.2s ease;
}

.period-badge.active {
    background: #E8913A;
    color: #ffffff;
}

.chart-container {
    height: 220px;
}

.bar-chart {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.chart-grid {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    height: 85%;
    margin-bottom: 12px;
}

.chart-bar {
    width: 36px;
    background: transparent;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    transition: all 0.3s ease;
}

.bar-fill {
    position: absolute;
    bottom: 0;
    width: 100%;
    border-radius: 6px 6px 0 0;
    transition: height 0.5s ease;
}

.bar-value {
    position: absolute;
    top: -28px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #475569;
}

.chart-labels {
    display: flex;
    justify-content: space-around;
    text-align: center;
    font-size: 0.75rem;
    color: #94a3b8;
    font-weight: 500;
}

.pie-chart-wrapper,
.donut-chart-wrapper {
    display: flex;
    height: 100%;
    align-items: center;
}

.pie-chart {
    position: relative;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    margin-right: 24px;
    flex-shrink: 0;
}

.donut-chart {
    position: relative;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    margin-right: 24px;
    flex-shrink: 0;
    background: #f1f5f9;
}

.pie-segment {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 50%;
}

.donut-segment {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 50%;
}

.pie-center,
.donut-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.pie-total,
.donut-total {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
}

.pie-label,
.donut-label {
    font-size: 0.75rem;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.pie-legend,
.donut-legend {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
}

.legend-item {
    display: flex;
    align-items: center;
    font-size: 0.85rem;
    color: #475569;
}

.legend-color {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 10px;
}

.legend-label {
    flex: 1;
    font-weight: 500;
}

.legend-value {
    font-weight: 600;
    color: #64748b;
}

.status-chart {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 8px 0;
}

.status-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.status-info {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 120px;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.status-label {
    font-size: 0.85rem;
    font-weight: 500;
    color: #475569;
}

.status-bar-container {
    flex: 1;
    height: 8px;
    background: #f1f5f9;
    border-radius: 4px;
    overflow: hidden;
}

.status-bar {
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s ease;
}

.status-count {
    width: 40px;
    text-align: right;
    font-size: 0.85rem;
    font-weight: 600;
    color: #1e293b;
}

.content-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 24px;
}

.card-container {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0 0 0 0.04);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.card-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 10px;
}

.card-icon {
    color: #E8913A;
    font-size: 20px;
}

.items-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.clickable-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px;
    border-radius: 12px;
    background: #f8fafc;
    cursor: pointer;
    transition: all 0.2s ease;
}

.clickable-item:hover {
    background: #f1f5f9;
    transform: translateX(4px);
}

.item-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    flex-shrink: 0;
}

.item-icon.personal { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.item-icon.reuniones { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.item-icon.misiones { background: linear-gradient(135deg, #10b981, #059669); }
.item-icon.misionero { background: linear-gradient(135deg, #f59e0b, #d97706); }
.item-icon.devocionales { background: linear-gradient(135deg, #ec4899, #db2777); }
.item-icon.cima { background: linear-gradient(135deg, #ef4444, #dc2626); }
.item-icon.voluntariado { background: linear-gradient(135deg, #6366f1, #4f46e5); }

.item-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    font-size: 24px;
    flex-shrink: 0;
}

.item-details {
    flex: 1;
    min-width: 0;
}

.item-title {
    margin: 0 0 4px 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: #1e293b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.item-meta {
    margin: 0;
    font-size: 0.8rem;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 6px;
}

.meta-date {
    color: #94a3b8;
}

.meta-divider {
    color: #cbd5e1;
}

.meta-type {
    background: #f1f5f9;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 500;
}

.meta-country {
    display: flex;
    align-items: center;
    gap: 4px;
}

.meta-country ion-icon {
    font-size: 12px;
}

.item-status {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
}

.item-status.pendiente {
    background: #fef3c7;
    color: #d97706;
}

.item-status.completado {
    background: #dcfce7;
    color: #16a34a;
}

.item-status.cancelado {
    background: #fee2e2;
    color: #dc2626;
}

.item-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 500;
    background: #dcfce7;
    color: #16a34a;
}

.item-badge ion-icon {
    font-size: 12px;
}

.item-arrow {
    color: #cbd5e1;
    font-size: 18px;
}

.empty-state {
    text-align: center;
    padding: 32px;
    color: #94a3b8;
}

.empty-state.full-width {
    grid-column: 1 / -1;
}

.empty-icon {
    font-size: 40px;
    margin-bottom: 8px;
    opacity: 0.5;
}

.empty-state p {
    margin: 0;
    font-size: 0.9rem;
}

.recent-visits-section {
    margin-bottom: 24px;
}

.visits-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}

.visit-card {
    background: #f8fafc;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.visit-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.visit-type {
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
}

.visit-type.tipo-prisma { background: #f3e8ff; color: #7c3aed; }
.visit-type.tipo-visita { background: #dbeafe; color: #2563eb; }
.visit-type.tipo-seguimiento { background: #dcfce7; color: #16a34a; }
.visit-type.tipo-otro { background: #f1f5f9; color: #64748b; }

.visit-date {
    font-size: 0.75rem;
    color: #94a3b8;
}

.visit-title {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.visit-meta {
    display: flex;
    gap: 12px;
    font-size: 0.75rem;
    color: #64748b;
}

.visit-meta .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.visit-meta ion-icon {
    font-size: 12px;
}

.visit-stats {
    display: flex;
    gap: 16px;
    padding-top: 10px;
    border-top: 1px solid #e2e8f0;
    margin-top: auto;
}

.stat-mini {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #E8913A;
}

.stat-mini ion-icon {
    font-size: 14px;
}

@media (max-width: 1400px) {
    .charts-grid {
        grid-template-columns: 1fr;
    }
    
    .visits-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 1024px) {
    .content-grid {
        grid-template-columns: 1fr;
    }
    
    .visits-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .content-padding {
        padding: 16px;
    }
    
    .stats-grid {
        grid-template-columns: 1fr 1fr;
    }
    
    .pie-chart-wrapper {
        flex-direction: column;
        align-items: center;
    }
    
    .pie-legend {
        margin-left: 0;
        margin-top: 16px;
    }
}

/* Dark Mode */
.dark .main-container {
    background-color: #111827;
}

.dark .page-title {
    color: #f3f4f6;
}

.dark .stat-card {
    background: #1f2937;
    border-color: #374151;
}

.dark .stat-value {
    color: #f3f4f6;
}

.dark .stat-label {
    color: #9ca3af;
}

.dark .chart-card {
    background: #1f2937;
    border-color: #374151;
}

.dark .chart-title {
    color: #f3f4f6;
}

.dark .period-badge {
    background: #374151;
    color: #9ca3af;
}

.dark .period-badge.active {
    background: #f0a85a;
    color: #1f2937;
}

.dark .bar-value {
    color: #9ca3af;
}

.dark .chart-labels {
    color: #6b7280;
}

.dark .pie-center,
.dark .donut-center {
    background: #1f2937;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark .pie-total,
.dark .donut-total {
    color: #f3f4f6;
}

.dark .legend-label {
    color: #d1d5db;
}

.dark .legend-value {
    color: #9ca3af;
}

.dark .status-bar-container {
    background: #374151;
}

.dark .status-label {
    color: #d1d5db;
}

.dark .status-count {
    color: #f3f4f6;
}

.dark .card-container {
    background: #1f2937;
    border-color: #374151;
}

.dark .card-title {
    color: #f3f4f6;
}

.dark .clickable-item {
    background: #374151;
}

.dark .clickable-item:hover {
    background: #4b5563;
}

.dark .item-title {
    color: #f3f4f6;
}

.dark .item-meta {
    color: #9ca3af;
}

.dark .meta-date {
    color: #6b7280;
}

.dark .meta-divider {
    color: #4b5563;
}

.dark .meta-type {
    background: #374151;
    color: #d1d5db;
}

.dark .item-arrow {
    color: #4b5563;
}

.dark .visit-card {
    background: #374151;
}

.dark .visit-title {
    color: #f3f4f6;
}

.dark .visit-date {
    color: #9ca3af;
}

.dark .visit-meta {
    color: #9ca3af;
}

.dark .visit-stats {
    border-top-color: #4b5563;
}

.dark .donut-chart {
    background: #374151;
}

.dark .empty-state {
    color: #6b7280;
}
</style>
