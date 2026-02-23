import { Activity } from '../types/activity';
import { Visita } from '../types/visita';
import { Voluntario } from '../types/voluntario';

const MOCK_VISITAS: Visita[] = [];
const MOCK_VOLUNTARIOS: Voluntario[] = [];

const MOCK_ACTIVITIES: Activity[] = [
    {
        id: '1',
        fecha: '2026-02-10T09:00:00',
        hora: '09:00',
        horaInicio: '09:00',
        actividad: 'prueba',
        tipo: 'Personal',
        estado: 'Pendiente',
        pais: 'Guatemala'
    },
    {
        id: '2',
        fecha: '2026-02-12T15:00:00',
        hora: '15:00',
        horaInicio: '15:00',
        actividad: 'Reunión Instituto',
        tipo: 'Reuniones',
        estado: 'Pendiente',
        pais: 'Guatemala'
    },
    {
        id: '3',
        fecha: '2026-02-05T10:00:00',
        hora: '10:00',
        horaInicio: '10:00',
        actividad: 'Taller Evangelismo',
        tipo: 'Misiones',
        estado: 'Completado',
        pais: 'El Salvador'
    },
    {
        id: '4',
        fecha: '2026-02-28T09:00:00',
        hora: '09:00',
        horaInicio: '09:00',
        actividad: 'Visita a Huehuetenango',
        tipo: 'Misiones',
        estado: 'Pendiente',
        pais: 'Guatemala'
    },
    {
        id: '5',
        fecha: '2026-02-28T14:00:00',
        hora: '14:00',
        horaInicio: '14:00',
        actividad: 'Visita Huehuetenango',
        tipo: 'Misiones',
        estado: 'Pendiente',
        pais: 'Guatemala'
    },
    {
        id: '6',
        fecha: '2026-02-28T18:00:00',
        hora: '18:00',
        horaInicio: '18:00',
        actividad: 'Visita Huehuetenango',
        tipo: 'Misiones',
        estado: 'Pendiente',
        pais: 'Guatemala'
    }
];

export const blink = {
    db: {
        activities: {
            list: async (options?: { orderBy?: { fecha: string } }) => {
                // Simular retardo de red
                await new Promise(resolve => setTimeout(resolve, 500));
                let data = [...MOCK_ACTIVITIES];
                if (options?.orderBy?.fecha === 'desc') {
                    data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
                }
                return data;
            },
            delete: async (id: string) => {
                await new Promise(resolve => setTimeout(resolve, 500));
                const index = MOCK_ACTIVITIES.findIndex(a => a.id === id);
                if (index > -1) {
                    MOCK_ACTIVITIES.splice(index, 1);
                }
            },
            create: async (activity: Omit<Activity, 'id'>) => {
                await new Promise(resolve => setTimeout(resolve, 500));
                const newActivity = { ...activity, id: Math.random().toString(36).substr(2, 9) };
                MOCK_ACTIVITIES.push(newActivity);
                return newActivity;
            },
            update: async (id: string, activity: Partial<Activity>) => {
                await new Promise(resolve => setTimeout(resolve, 500));
                const index = MOCK_ACTIVITIES.findIndex(a => a.id === id);
                if (index > -1) {
                    MOCK_ACTIVITIES[index] = { ...MOCK_ACTIVITIES[index], ...activity };
                    return MOCK_ACTIVITIES[index];
                }
            }
        },
        visitas: {
            list: async () => {
                await new Promise(resolve => setTimeout(resolve, 500));
                return [...MOCK_VISITAS];
            },
            create: async (visita: Omit<Visita, 'id'>) => {
                await new Promise(resolve => setTimeout(resolve, 500));
                const newVisita = { ...visita, id: Math.random().toString(36).substr(2, 9) };
                MOCK_VISITAS.push(newVisita as Visita);
                return newVisita;
            },
            update: async (id: string, visita: Partial<Visita>) => {
                await new Promise(resolve => setTimeout(resolve, 500));
                const index = MOCK_VISITAS.findIndex(v => v.id === id);
                if (index > -1) {
                    MOCK_VISITAS[index] = { ...MOCK_VISITAS[index], ...visita };
                    return MOCK_VISITAS[index];
                }
            },
            delete: async (id: string) => {
                await new Promise(resolve => setTimeout(resolve, 500));
                const index = MOCK_VISITAS.findIndex(v => v.id === id);
                if (index > -1) {
                    MOCK_VISITAS.splice(index, 1);
                }
            }
        },
        voluntarios: {
            list: async (options?: { orderBy?: { fechaInscripcion: string } }) => {
                await new Promise(resolve => setTimeout(resolve, 500));
                let data = [...MOCK_VOLUNTARIOS];
                if (options?.orderBy?.fechaInscripcion === 'desc') {
                    data.sort((a, b) => new Date(b.fechaInscripcion).getTime() - new Date(a.fechaInscripcion).getTime());
                }
                return data;
            },
            create: async (voluntario: Partial<Voluntario>) => {
                await new Promise(resolve => setTimeout(resolve, 500));
                const id = (voluntario as any).id || Math.random().toString(36).substr(2, 9);
                const newVoluntario = { ...voluntario, id };
                MOCK_VOLUNTARIOS.push(newVoluntario as Voluntario);
                return newVoluntario;
            },
            update: async (id: string, voluntario: Partial<Voluntario>) => {
                await new Promise(resolve => setTimeout(resolve, 500));
                const index = MOCK_VOLUNTARIOS.findIndex(v => v.id === id);
                if (index > -1) {
                    MOCK_VOLUNTARIOS[index] = { ...MOCK_VOLUNTARIOS[index], ...voluntario };
                    return MOCK_VOLUNTARIOS[index];
                }
            },
            delete: async (id: string) => {
                await new Promise(resolve => setTimeout(resolve, 500));
                const index = MOCK_VOLUNTARIOS.findIndex(v => v.id === id);
                if (index > -1) {
                    MOCK_VOLUNTARIOS.splice(index, 1);
                }
            }
        }
    }
};
