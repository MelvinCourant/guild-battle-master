import { createApp } from 'vue';
import { createPinia } from "pinia";
import App from '@/App.vue';
import router from '@/router';
import { useUserStore } from "@stores/user";

const app = createApp(App);
app.use(router).use(createPinia()).mount('#app');

router.beforeEach(async (to: any, from: any, next: any) => {
    const userStore = useUserStore();

    if(userStore.isLogged) {
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