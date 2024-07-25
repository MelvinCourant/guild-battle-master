import { createApp, ref } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/index.js";
import { useUserStore } from "./stores/user.js";
import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

const env = import.meta.env;
const app = createApp(App);
const locale = ref("en");

if (/^fr\b/.test(navigator.language)) {
  locale.value = "fr";
}

const i18n = createI18n({
  legacy: false,
  locale: locale.value,
  fallbackLocale: "en",
  messages: {
    en,
    fr,
  },
});

app.use(router).use(createPinia()).use(i18n).mount("#app");

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  let isLogged = false;

  async function verifyUser() {
    const result = await fetch(`${env.VITE_URL}/api/users/verify`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userStore.token}`,
      },
    });

    if (result.status === 200) {
      const data = await result.json();
      userStore.updateUser(data.user, false);
      isLogged = true;
    } else {
      userStore.logout();
    }
  }

  if (userStore.token) {
    await verifyUser();
  }

  const pathsWithPermissions = [
    {
      path: "/composition",
      roles: ["leader", "moderator"],
      redirect: "/defenses",
    },
    {
      path: "/upload-json/guild",
      roles: ["leader", "moderator"],
      redirect: "/upload-json",
    },
    {
      path: "/tower",
      roles: ["leader", "moderator"],
      redirect: "/map",
    },
  ];

  if (isLogged) {
    const pathHavePermission = pathsWithPermissions.find(
      (path) => to.path.match(path.path) !== null,
    );

    if (pathHavePermission) {
      if (!pathHavePermission.roles.includes(userStore.user.role)) {
        next({ path: pathHavePermission.redirect });
      } else {
        next();
      }
    }

    if (
      to.path === "/login" ||
      to.path === "/register" ||
      to.path === "/forgot-password" ||
      to.path === "/reset-password"
    ) {
      next({ path: from.path });
    } else {
      next();
    }
  } else {
    if (
      to.path === "/login" ||
      to.path === "/register" ||
      to.path === "/forgot-password" ||
      to.path === "/reset-password"
    ) {
      next();
    } else {
      next({ path: "/login" });
    }
  }
});
