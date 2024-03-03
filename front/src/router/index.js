import { createRouter, createWebHistory } from 'vue-router';
import Home from '@views/Home.vue';
import Map from '@views/Map.vue';

const router = createRouter(
{
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/map',
            component: Map
        }
    ]
});

export default router;
