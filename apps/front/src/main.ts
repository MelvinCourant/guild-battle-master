import { createApp } from 'vue';
import { createPinia } from "pinia";
import App from './App.vue';
import router from './router';
import { useUserStore } from "./stores/user";

const env = import.meta.env;
const app = createApp(App);
app.use(router).use(createPinia()).mount('#app');

router.beforeEach(async (to: any, from: any, next: any) => {
    const userStore = useUserStore();
    let isLogged: boolean = false;

    async function verifyUser() {
        const result = await fetch(`${env.VITE_URL}/api/users/verify`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userStore.token}`
            }
        });

        if(result.status === 200) {
            const data = await result.json();
            userStore.updateUser(data.user);
            isLogged = true;
        } else {
            userStore.logout();
        }
    }

    if(userStore.token) {
        await verifyUser();
    }

    if(isLogged) {
        if(to.path === "/login" || to.path === "/register") {
            next({ path: from.path });
        } else {
            next();
        }
    } else {
        if(to.path === "/login" || to.path === "/register") {
            next();
        } else {
            next({ path: "/login" });
        }
    }
});