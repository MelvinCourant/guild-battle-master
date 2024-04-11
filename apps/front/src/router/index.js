import { createRouter, createWebHistory } from 'vue-router';
import Guild from '../views/Guild.vue';
import Map from '../views/Map.vue';
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Logout from "../views/Logout.vue";
import UploadJson from "../views/UploadJson.vue";

const router = createRouter(
{
    history: createWebHistory(),
    routes: [
        {
            path: '/guild',
            component: Guild,
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
        },
        {
            path: '/upload-json',
            component: UploadJson
        },
        {
            path: '/upload-json/:id',
            component: UploadJson
        }
    ]
});

export default router;
