<template>
    <div class="calendar-container">
        <div class="calendar-header">
            <div class="header-left">
                <ion-button fill="clear" size="small" @click="goToToday" class="today-btn">
                    Hoy
                </ion-button>

                <div class="navigation-controls">
                    <ion-button fill="clear" @click="navigatePrev">
                        <ion-icon slot="icon-only" :icon="chevronBackOutline"></ion-icon>
                    </ion-button>

                    <h3 class="month-title">
                        {{ currentViewTitle }}
                    </h3>

                    <ion-button fill="clear" @click="navigateNext">
                        <ion-icon slot="icon-only" :icon="chevronForwardOutline"></ion-icon>
                    </ion-button>
                </div>
            </div>

            <div class="view-selector">
                <ion-segment v-model="currentView" mode="ios" @ionChange="handleViewChange">
                    <ion-segment-button value="day">
                        <ion-label>Day</ion-label>
                    </ion-segment-button>
                    <ion-segment-button value="week">
                        <ion-label>Week</ion-label>
                    </ion-segment-button>
                    <ion-segment-button value="month">
                        <ion-label>Month</ion-label>
                    </ion-segment-button>
                </ion-segment>
            </div>
        </div>

        <!-- Vista Mensual -->
        <div v-if="currentView === 'month'" class="calendar-grid">
            <div class="weekday-header-row">
                <div v-for="dayName in weekDays" :key="dayName" class="weekday-header">
                    {{ dayName }}
                </div>
            </div>

            <div class="days-grid">
                <div v-for="(day, i) in calendarDays" :key="i" class="day-cell" :class="{
                    'not-current-month': !isSameMonth(day, monthStart),
                    'is-today': isSameDay(day, new Date())
                }">
                    <div class="day-number-container">
                        <span class="day-number">{{ format(day, 'd') }}</span>
                    </div>

                    <div class="activities-stack">
                        <button v-for="activity in getActivitiesForDay(day).slice(0, 3)" :key="activity.id"
                            @click="$emit('selectActivity', activity)" class="activity-tag"
                            :class="getActivityColor(activity.tipo)">
                            {{ activity.actividad }}
                        </button>

                        <span v-if="getActivitiesForDay(day).length > 3" class="more-indicator">
                            + {{ getActivitiesForDay(day).length - 3 }} más
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Vista Semanal -->
        <div v-if="currentView === 'week'" class="week-view">
            <div class="week-header">
                <div class="time-column-header"></div>
                <div class="days-header">
                    <div v-for="(day, index) in weekDaysData" :key="index" class="day-header" :class="{
                        'is-today': isSameDay(day, new Date())
                    }">
                        <div class="day-number-week">{{ format(day, 'd') }}</div>
                        <div class="day-name-week">{{ weekDaysShort[index] }}</div>
                    </div>
                </div>
            </div>

            <div class="week-body">
                <div class="time-column">
                    <div v-for="hour in 24" :key="hour" class="time-slot-label">
                        {{ formatHour(hour - 1) }}
                    </div>
                </div>

                <div class="days-grid-week">
                    <div v-for="(day, dayIndex) in weekDaysData" :key="dayIndex" class="day-column">
                        <div v-for="hour in 24" :key="hour" class="hour-slot" :class="{
                            'is-current-hour': isCurrentHour(day, hour - 1)
                        }">
                        </div>

                        <div v-for="activity in getActivitiesForDay(day)" :key="activity.id" class="week-activity"
                            :class="getActivityColor(activity.tipo)" :style="getActivityPosition(activity)"
                            @click="$emit('selectActivity', activity)">
                            {{ activity.actividad }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Vista Diaria -->
        <div v-if="currentView === 'day'" class="day-view">
            <div class="day-header-single">
                <div class="day-number-large">{{ format(currentDate, 'd') }}</div>
                <div class="day-name-large">{{ format(currentDate, 'EEEE', { locale: es }) }}</div>
            </div>

            <div class="day-body">
                <div class="time-column">
                    <div v-for="hour in 24" :key="hour" class="time-slot-label">
                        {{ formatHour(hour - 1) }}
                    </div>
                </div>

                <div class="day-events">
                    <div v-for="hour in 24" :key="hour" class="hour-slot" :class="{
                        'is-current-hour': isCurrentHour(currentDate, hour - 1)
                    }">
                    </div>

                    <div v-for="activity in getActivitiesForDay(currentDate)" :key="activity.id" class="day-activity"
                        :class="getActivityColor(activity.tipo)" :style="getActivityPosition(activity)"
                        @click="$emit('selectActivity', activity)">
                        <div class="activity-time">{{ activity.hora }}</div>
                        <div class="activity-title">{{ activity.actividad }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths,
    addWeeks, subWeeks, addDays, subDays, startOfDay, endOfDay,
    getHours, getMinutes, parseISO
} from 'date-fns';
import { es } from 'date-fns/locale';
import { IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { Activity } from '../../types/activity';

const props = defineProps<{
    activities: Activity[]
}>();

const emit = defineEmits(['selectActivity']);

const currentDate = ref(new Date());
const currentView = ref('month');
const weekDays = ['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do'];
const weekDaysShort = ['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do'];

// Computeds para vistas
const monthStart = computed(() => startOfMonth(currentDate.value));
const calendarDays = computed(() => {
    const start = startOfWeek(monthStart.value, { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(monthStart.value), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
});

const weekDaysData = computed(() => {
    const start = startOfWeek(currentDate.value, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate.value, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
});

const currentViewTitle = computed(() => {
    if (currentView.value === 'month') {
        return format(currentDate.value, 'MMMM yyyy', { locale: es });
    } else if (currentView.value === 'week') {
        const start = startOfWeek(currentDate.value, { weekStartsOn: 1 });
        const end = endOfWeek(currentDate.value, { weekStartsOn: 1 });
        return `${format(start, 'd')} - ${format(end, 'd MMM', { locale: es })}`;
    } else {
        return format(currentDate.value, 'EEEE d MMMM', { locale: es });
    }
});

// Navegación
const navigateNext = () => {
    if (currentView.value === 'month') {
        currentDate.value = addMonths(currentDate.value, 1);
    } else if (currentView.value === 'week') {
        currentDate.value = addWeeks(currentDate.value, 1);
    } else {
        currentDate.value = addDays(currentDate.value, 1);
    }
};

const navigatePrev = () => {
    if (currentView.value === 'month') {
        currentDate.value = subMonths(currentDate.value, 1);
    } else if (currentView.value === 'week') {
        currentDate.value = subWeeks(currentDate.value, 1);
    } else {
        currentDate.value = subDays(currentDate.value, 1);
    }
};

const goToToday = () => {
    currentDate.value = new Date();
};

const handleViewChange = (event: any) => {
    currentView.value = event.detail.value;
};

// Filtrado de actividades
const getActivitiesForDay = (day: Date) => {
    return props.activities.filter(a => {
        try {
            return isSameDay(new Date(a.fecha), day);
        } catch {
            return false;
        }
    });
};

// Verificar hora actual
const isCurrentHour = (day: Date, hour: number) => {
    const now = new Date();
    return isSameDay(day, now) && getHours(now) === hour;
};

// Formatear hora
const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
};

// Calcular posición de actividad en la cuadrícula
const getActivityPosition = (activity: Activity) => {
    try {
        const [hours, minutes] = activity.hora.split(':').map(Number);
        const top = (hours * 60 + minutes) * (50 / 60); // 50px por hora
        const duration = 60; // Asumimos 1 hora por defecto, se podría calcular con horaFin
        const height = duration * (50 / 60);

        return {
            top: `${top}px`,
            height: `${height}px`
        };
    } catch {
        return { top: '0px', height: '50px' };
    }
};

const getActivityColor = (type: string) => {
    const t = type.toLowerCase();
    if (t === 'personal') return 'bg-amber';
    if (t === 'reuniones') return 'bg-blue';
    if (t === 'misiones') return 'bg-emerald';
    if (t === 'cima') return 'bg-indigo';
    if (t === 'devocionales') return 'bg-orange';
    if (t === 'voluntariado') return 'bg-rose';
    return 'bg-slate';
};
</script>

<style scoped>
.calendar-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 500px;
    background: #ffffff;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    border-radius: 8px;
}

.calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #e5e7eb;
    background: #ffffff;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 20px;
}

.today-btn {
    --color: #E8913A;
    font-weight: 600;
    --ripple-color: rgba(232, 145, 58, 0.2);
    text-transform: none;
}

.navigation-controls {
    display: flex;
    align-items: center;
    gap: 4px;
    background: #f3f4f6;
    border-radius: 8px;
    padding: 2px;
}

.month-title {
    font-size: 1.1rem;
    font-weight: 600;
    text-transform: capitalize;
    margin: 0;
    min-width: 200px;
    text-align: center;
    color: #1f2937;
}

.view-selector ion-segment {
    --background: #f3f4f6;
}

/* Grid del Calendario - Vista Mensual */
.calendar-grid {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
}

.weekday-header-row {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
}

.weekday-header {
    padding: 12px 8px;
    text-align: center;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #6b7280;
    letter-spacing: 0.05em;
}

.days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    flex: 1;
}

.day-cell {
    min-height: 120px;
    padding: 8px;
    border-right: 1px solid #f3f4f6;
    border-bottom: 1px solid #f3f4f6;
    transition: background 0.2s;
    display: flex;
    flex-direction: column;
    position: relative;
    background: #ffffff;
}

.day-cell:hover {
    background: #fefce8;
}

.not-current-month {
    background: #f9fafb;
    color: #9ca3af;
}

.day-number-container {
    margin-bottom: 6px;
    display: flex;
    justify-content: flex-start;
}

.day-number {
    font-size: 0.9rem;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-weight: 500;
    color: #374151;
}

.is-today .day-number {
    background: #E8913A;
    color: white;
    font-weight: 700;
    box-shadow: 0 2px 4px rgba(232, 145, 58, 0.3);
}

/* Actividades */
.activities-stack {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
}

.activity-tag {
    border: none;
    border-radius: 6px;
    padding: 4px 8px;
    font-size: 0.7rem;
    font-weight: 600;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    color: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transition: transform 0.1s, opacity 0.1s;
}

.activity-tag:hover {
    transform: translateY(-1px);
    opacity: 0.9;
}

.more-indicator {
    font-size: 0.7rem;
    color: #6b7280;
    padding-left: 6px;
    font-weight: 500;
}

/* Vista Semanal */
.week-view {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
}

.week-header {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
}

.time-column-header {
    width: 60px;
    border-right: 1px solid #e5e7eb;
}

.days-header {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}

.day-header {
    padding: 12px 8px;
    text-align: center;
    border-right: 1px solid #e5e7eb;
}

.day-header:last-child {
    border-right: none;
}

.day-header.is-today .day-number-week {
    background: #E8913A;
    color: white;
}

.day-number-week {
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin: 0 auto 4px;
}

.day-name-week {
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
    text-transform: lowercase;
}

.week-body {
    display: flex;
    flex: 1;
    overflow-y: auto;
}

.time-column {
    width: 60px;
    background: #f9fafb;
    border-right: 1px solid #e5e7eb;
    flex-shrink: 0;
}

.time-slot-label {
    height: 50px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 4px;
    font-size: 0.7rem;
    color: #6b7280;
    border-bottom: 1px solid #f3f4f6;
}

.days-grid-week {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}

.day-column {
    position: relative;
    border-right: 1px solid #e5e7eb;
}

.day-column:last-child {
    border-right: none;
}

.hour-slot {
    height: 50px;
    border-bottom: 1px solid #f3f4f6;
}

.hour-slot.is-current-hour {
    background: rgba(232, 145, 58, 0.1);
}

.week-activity {
    position: absolute;
    left: 4px;
    right: 4px;
    border-radius: 6px;
    padding: 4px 8px;
    font-size: 0.75rem;
    font-weight: 500;
    color: white;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: transform 0.1s, box-shadow 0.1s;
    z-index: 10;
}

.week-activity:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* Vista Diaria */
.day-view {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
}

.day-header-single {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 24px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
}

.day-number-large {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.day-number-large.is-today {
    background: #E8913A;
    color: white;
}

.day-name-large {
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    text-transform: capitalize;
}

.day-body {
    display: flex;
    flex: 1;
    overflow-y: auto;
}

.day-events {
    flex: 1;
    position: relative;
}

.day-activity {
    position: absolute;
    left: 16px;
    right: 16px;
    border-radius: 8px;
    padding: 12px 16px;
    color: white;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: transform 0.1s, box-shadow 0.1s;
    z-index: 10;
}

.day-activity:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.activity-time {
    font-size: 0.75rem;
    opacity: 0.9;
    margin-bottom: 4px;
}

.activity-title {
    font-size: 0.9rem;
    font-weight: 600;
}

/* Colores de Actividades */
.bg-amber {
    background: #E8913A;
}

.bg-blue {
    background: #3b82f6;
}

.bg-emerald {
    background: #10b981;
}

.bg-indigo {
    background: #6366f1;
}

.bg-orange {
    background: #f97316;
}

.bg-rose {
    background: #f43f5e;
}

.bg-slate {
    background: #64748b;
}

@media (max-width: 768px) {
    .calendar-container {
        min-height: 450px;
        height: 450px;
    }

    .view-selector {
        display: none;
    }

    .calendar-header {
        padding: 8px 12px;
        gap: 8px;
    }

    .header-left {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    .today-btn {
        font-size: 0.75rem;
        min-width: 40px;
    }

    .navigation-controls {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .month-title {
        font-size: 0.9rem;
        min-width: auto;
        margin: 0 8px;
        text-align: center;
    }

    .calendar-grid {
        flex: 1;
        min-height: 350px;
        overflow: hidden;
    }

    .weekday-header {
        padding: 6px 2px;
        font-size: 0.6rem;
    }

    .days-grid {
        overflow-y: auto;
    }

    .day-cell {
        min-height: 70px;
        padding: 2px;
    }

    .day-number {
        width: 20px;
        height: 20px;
        font-size: 0.7rem;
    }

    .activities-stack {
        gap: 2px;
    }

    .activity-tag {
        font-size: 0.55rem;
        padding: 1px 3px;
        border-radius: 3px;
    }

    .more-indicator {
        font-size: 0.55rem;
        padding-left: 2px;
    }

    .week-view {
        min-height: 400px;
        height: 400px;
    }

    .week-header {
        overflow-x: auto;
        flex-shrink: 0;
    }

    .days-header {
        min-width: 100%;
    }

    .day-header {
        padding: 6px 4px;
        flex: 1;
        min-width: 40px;
    }

    .day-number-week {
        width: 24px;
        height: 24px;
        font-size: 0.8rem;
    }

    .day-name-week {
        font-size: 0.6rem;
    }

    .week-body {
        overflow-x: auto;
        overflow-y: auto;
    }

    .days-grid-week {
        min-width: 100%;
    }

    .day-column {
        min-width: 40px;
        flex: 1;
    }

    .time-column {
        width: 40px;
        min-width: 40px;
    }

    .time-column-header {
        width: 40px;
        min-width: 40px;
    }

    .time-slot-label {
        font-size: 0.55rem;
        height: 35px;
        padding-top: 2px;
    }

    .hour-slot {
        height: 35px;
    }

    .week-activity {
        font-size: 0.55rem;
        padding: 2px 3px;
    }

    .day-view {
        min-height: 400px;
        height: 400px;
    }

    .day-header-single {
        padding: 10px 12px;
        flex-shrink: 0;
    }

    .day-number-large {
        font-size: 1.5rem;
        width: 45px;
        height: 45px;
    }

    .day-name-large {
        font-size: 1rem;
    }

    .day-activity {
        padding: 6px 10px;
    }

    .activity-time {
        font-size: 0.65rem;
    }

    .activity-title {
        font-size: 0.8rem;
    }
}

@media (max-width: 480px) {
    .calendar-container {
        min-height: 400px;
        height: 400px;
    }

    .calendar-header {
        padding: 6px 8px;
    }

    .today-btn {
        font-size: 0.7rem;
        min-width: 36px;
    }

    .month-title {
        font-size: 0.8rem;
        margin: 0 4px;
    }

    .calendar-grid {
        min-height: 300px;
    }

    .day-cell {
        min-height: 60px;
    }

    .day-number {
        width: 18px;
        height: 18px;
        font-size: 0.65rem;
    }

    .weekday-header {
        font-size: 0.55rem;
        padding: 4px 1px;
    }
}

@media (max-width: 768px) {
    .calendar-container {
        min-height: 500px;
    }

    .view-selector {
        display: none;
    }

    .calendar-header {
        padding: 12px;
        flex-wrap: wrap;
        gap: 10px;
    }

    .header-left {
        width: 100%;
        justify-content: space-between;
    }

    .navigation-controls {
        flex: 1;
        justify-content: center;
    }

    .month-title {
        min-width: 100px;
        font-size: 0.95rem;
    }

    .calendar-grid {
        min-height: 400px;
    }

    .weekday-header {
        padding: 8px 4px;
        font-size: 0.65rem;
    }

    .day-cell {
        min-height: 100px;
        padding: 4px;
    }

    .day-number {
        width: 24px;
        height: 24px;
        font-size: 0.75rem;
    }

    .activity-tag {
        font-size: 0.6rem;
        padding: 2px 4px;
        border-radius: 4px;
    }

    .more-indicator {
        font-size: 0.6rem;
    }

    .week-view {
        min-height: 450px;
    }

    .week-header {
        overflow-x: auto;
    }

    .days-header {
        min-width: 400px;
    }

    .day-header {
        padding: 8px 4px;
    }

    .day-number-week {
        width: 28px;
        height: 28px;
        font-size: 0.85rem;
    }

    .day-name-week {
        font-size: 0.65rem;
    }

    .week-body {
        overflow-x: auto;
    }

    .days-grid-week {
        min-width: 400px;
    }

    .time-column {
        width: 45px;
    }

    .time-column-header {
        width: 45px;
    }

    .time-slot-label {
        font-size: 0.6rem;
        height: 40px;
    }

    .hour-slot {
        height: 40px;
    }

    .week-activity {
        font-size: 0.6rem;
        padding: 2px 4px;
    }

    .day-view {
        min-height: 450px;
    }

    .day-header-single {
        padding: 12px 16px;
    }

    .day-number-large {
        font-size: 2rem;
        width: 50px;
        height: 50px;
    }

    .day-name-large {
        font-size: 1.2rem;
    }

    .day-activity {
        padding: 8px 12px;
    }

    .activity-time {
        font-size: 0.7rem;
    }

    .activity-title {
        font-size: 0.85rem;
    }
}

@media (max-width: 480px) {
    .calendar-container {
        min-height: 450px;
    }

    .today-btn {
        font-size: 0.8rem;
        padding: 4px 8px;
    }

    .month-title {
        font-size: 0.85rem;
        min-width: 80px;
    }

    .calendar-grid {
        min-height: 350px;
    }

    .day-cell {
        min-height: 80px;
    }

    .weekday-header {
        font-size: 0.6rem;
    }
}
</style>