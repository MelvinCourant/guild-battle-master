import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/index.js";
import { useUserStore } from "./stores/user.js";

const env = import.meta.env;
const app = createApp(App);
app.use(router).use(createPinia()).mount("#app");

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
  ];

  if (isLogged) {
    const pathHavePermission = pathsWithPermissions.find(
      (path) => path.path === to.path,
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
