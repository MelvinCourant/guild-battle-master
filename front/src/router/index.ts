import { createRouter, createWebHistory } from 'vue-router';
import Home from '@views/Home.vue';
import Map from '@views/Map.vue';
import Login from "@views/Login.vue";
import Register from "@views/Register.vue";
import Logout from "@views/Logout.vue";

const router = createRouter(
{
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Home,
        },
        {
            path: '/map',
            component: Map
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/register',
            component: Register
        },
        {
            path: '/logout',
            component: Logout
        }
    ]
});

export default router;
