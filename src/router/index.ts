import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Activities from '../views/Activities.vue'
import Voluntarios from '../views/Voluntarios.vue'
import Visitas from '../views/Visitas.vue'
import Map from '../views/Map.vue'
import Home from '../views/Home.vue'
import Noticias from '../views/Noticias.vue'
import Kiosco from '../views/Kiosco.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        component: Home
    },
    {
        path: '/activities',
        component: Activities
    },
    {
        path: '/voluntarios',
        component: Voluntarios
    },
    {
        path: '/visitas',
        component: Visitas
    },
    {
        path: '/map',
        component: Map
    },
    {
        path: '/noticias',
        component: Noticias
    },
    {
        path: '/kiosco',
        component: Kiosco
    }

]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
