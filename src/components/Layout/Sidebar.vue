<template>
    <aside class="sidebar-rail" :class="{ 'is-open': isSidebarOpen }">
        <div class="logo-wrapper" @click="toggleSidebar">
            <div class="icon-box-active">
                <ion-icon :icon="hardwareChip" class="main-icon"></ion-icon>
            </div>
        </div>

        <nav class="nav-container">
            <button v-for="(item, i) in navItems" :key="i" :title="item.label" class="nav-button"
                :class="{ 'is-active': isActive(item.path) }" @click="navigateTo(item.path)">
                <ion-icon :icon="item.icon" class="nav-icon"></ion-icon>
                <div v-if="isActive(item.path)" class="active-indicator"></div>
            </button>
        </nav>
    </aside>
    <div v-if="isSidebarOpen" class="sidebar-backdrop" @click="toggleSidebar"></div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import { useLayout } from '@/composables/useLayout';
import {
    homeOutline,
    calendarOutline,
    peopleOutline,
    locationOutline,
    mapOutline,
    hardwareChip,
    newspaperOutline,
    storefrontOutline,
    heartCircleOutline
} from 'ionicons/icons';

const route = useRoute();
const router = useRouter();
const { isSidebarOpen, toggleSidebar } = useLayout();

const isActive = (path: string) => {
    return route.path === path;
};

const navigateTo = (path: string) => {
    router.push(path);
    // En móvil, cerrar al navegar
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
};

// Mapeo de items con iconos de Ionicons
const navItems = [
    { icon: homeOutline, label: 'Inicio', path: '/home' },
    { icon: heartCircleOutline, label: 'Copiloto', path: '/copiloto' },
    { icon: calendarOutline, label: 'Calendario', path: '/activities' },
    { icon: locationOutline, label: 'Visitas', path: '/visitas' },
    { icon: peopleOutline, label: 'Voluntarios', path: '/voluntarios' },
    { icon: mapOutline, label: 'Mapa', path: '/map' },
    { icon: newspaperOutline, label: 'Noticias', path: '/noticias' },
    { icon: storefrontOutline, label: 'Kiosco', path: '/kiosco' },
];
</script>

<style scoped>
.sidebar-rail {
    width: 70px;
    height: 100vh;
    background: #ffffff;
    border-right: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 0;
    position: sticky;
    top: 0;
    z-index: 100;
    transition: transform 0.3s ease;
}

.logo-wrapper {
    margin-bottom: 24px;
    cursor: pointer;
}

.icon-box-active {
    width: 44px;
    height: 44px;
    background: #fef3c7;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
}

.icon-box-active:active {
    transform: scale(0.95);
}

.main-icon {
    font-size: 24px;
    color: #E8913A;
}

.nav-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.nav-button {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    border: none;
    background: transparent;
    color: #6b7280;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.2s ease;
    cursor: pointer;
    padding: 0;
}

.nav-button:hover {
    background: #f3f4f6;
}

.nav-button.is-active {
    background: #fef3c7;
    color: #E8913A;
}

.nav-icon {
    font-size: 24px;
    pointer-events: none;
}

.active-indicator {
    position: absolute;
    left: -11px;
    top: 25%;
    height: 50%;
    width: 4px;
    background: #E8913A;
    border-radius: 0 4px 4px 0;
}

.sidebar-backdrop {
    display: none;
    /* Desktop */
}

/* Ocultar en móviles si es necesario, ya que Ionic suele usar Tabs abajo */
@media (max-width: 768px) {
    .sidebar-rail {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        transform: translateX(-100%);
        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    }

    .sidebar-rail.is-open {
        transform: translateX(0);
    }

    .sidebar-backdrop {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 90;
    }
}

.dark .sidebar-rail {
    background: #1f2937;
    border-right-color: #374151;
}

.dark .nav-button {
    color: #9ca3af;
}

.dark .nav-button:hover {
    background: #374151;
}

.dark .nav-button.is-active {
    background: #374151;
    color: #f0a85a;
}

.dark .active-indicator {
    background: #f0a85a;
}

.dark .icon-box-active {
    background: #374151;
}

.dark .main-icon {
    color: #f0a85a;
}
</style>
