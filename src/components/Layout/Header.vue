<template>
    <ion-header class="ion-no-border">
        <ion-toolbar class="header-toolbar">
            <ion-buttons slot="start">
                <div class="logo-container" @click="toggleSidebar">
                    <div class="logo-box">M</div>
                    <span class="logo-text">
                        Movida <span class="logo-subtext">GT</span>
                    </span>
                </div>
            </ion-buttons>
            <div class="search-wrapper">
                <ion-searchbar placeholder="Search Actividades Movida" class="custom-search"></ion-searchbar>
            </div>
            <ion-buttons slot="end">
                <ion-avatar>
                    <img alt="Silhouette of a person's head"
                        src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                </ion-avatar>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
</template>

<script setup lang="ts">
import {
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonAvatar
} from '@ionic/vue';
import { useLayout } from '@/composables/useLayout';

const { toggleSidebar } = useLayout();
</script>

<style scoped>
/* Estructura Base */
.header-toolbar {
    --background: #ffffff;
    --border-style: none;
    padding: 0 16px;
    height: 64px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Logo Styles */
.logo-container {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
}

.logo-box {
    width: 32px;
    height: 32px;
    background: var(--ion-color-primary);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
}

.logo-text {
    font-weight: 700;
    font-size: 1.1rem;
    color: #1f2937;
}

.logo-subtext {
    font-weight: 400;
    color: #6b7280;
}

/* Buscador */
.search-wrapper {
    flex: 1;
    max-width: 600px;
    margin-left: 32px;
}

.custom-search {
    --background: #f3f4f6;
    --border-radius: 8px;
    --placeholder-color: #9ca3af;
    padding: 0;
}

.chevron-button {
    --padding-start: 0;
    --padding-end: 0;
    width: 2px;
    height: 2px;
}

/* Avatar del Usuario */
ion-avatar {
    width: 32px;
    height: 32px;
    margin-left: 8px;
}

/* Media Query para ocultar texto en móviles pequeños */
@media (max-width: 576px) {

    .logo-text,
    .search-wrapper {
        display: none;
    }
}
</style>