import { createRouter, createWebHashHistory } from 'vue-router';
import Guild from '../views/Guild.vue';
import Defenses from "../views/Defenses.vue";
import Map from '../views/Map.vue';
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Logout from "../views/Logout.vue";
import UploadJson from "../views/UploadJson.vue";
import Member from "../views/Member.vue";
import Composition from "../views/Composition.vue";

const router = createRouter(
{
    history: createWebHashHistory(),
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
            path: '/defenses',
            component: Defenses
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
        },
        {
            path: '/upload-json/guild',
            component: UploadJson
        },
        {
            path: '/member',
            component: Member
        },
        {
            path: '/member/:id',
            component: Member
        },
        {
            path: '/composition',
            component: Composition
        },
        {
            path: '/composition/:id',
            component: Composition
        }
    ]
});

export default router;
