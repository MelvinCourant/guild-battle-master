import { createRouter, createWebHistory } from "vue-router";
import Guild from "../views/Guild.vue";
import Defenses from "../views/Defenses.vue";
import Map from "../views/Map.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Logout from "../views/Logout.vue";
import UploadJson from "../views/UploadJson.vue";
import Member from "../views/Member.vue";
import Composition from "../views/Composition.vue";
import Notifications from "../views/NotificationsPage.vue";
import Tower from "../views/Tower.vue";
import DefensesPerMember from "../views/DefensesPerMember.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";
import AboutUs from "../views/AboutUs.vue";
import AdminGuilds from "../views/admin/AdminGuilds.vue";
import AdminUsers from "../views/admin/AdminUsers.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Guild,
      meta: {
        title: "guild",
      },
    },
    {
      path: "/guild/:id",
      component: Guild,
      meta: {
        title: "guild",
      },
    },
    {
      path: "/map",
      component: Map,
      meta: {
        title: "siege_map",
      },
    },
    {
      path: "/defenses",
      component: Defenses,
      meta: {
        title: "defenses",
      },
    },
    {
      path: "/login",
      component: Login,
      meta: {
        title: "login",
      },
    },
    {
      path: "/register",
      component: Register,
      meta: {
        title: "register",
      },
    },
    {
      path: "/logout",
      component: Logout,
    },
    {
      path: "/upload-json",
      component: UploadJson,
      meta: {
        title: "Importer un JSON",
      },
    },
    {
      path: "/upload-json/:id",
      component: UploadJson,
      meta: {
        title: "upload_json",
      },
    },
    {
      path: "/upload-json/guild",
      component: UploadJson,
      meta: {
        title: "upload_json",
      },
    },
    {
      path: "/member",
      component: Member,
      meta: {
        title: "member",
      },
    },
    {
      path: "/member/:id",
      component: Member,
      meta: {
        title: "member",
      },
    },
    {
      path: "/composition",
      component: Composition,
      meta: {
        title: "add_composition",
      },
    },
    {
      path: "/composition/:id",
      component: Composition,
      meta: {
        title: "update_composition",
      },
    },
    {
      path: "/notifications",
      component: Notifications,
      meta: {
        title: "notifications",
      },
    },
    {
      path: "/tower/:id",
      component: Tower,
      meta: {
        title: "update_tower",
      },
    },
    {
      path: "/defenses-per-member",
      component: DefensesPerMember,
      meta: {
        title: "defenses_per_member",
      },
    },
    {
      path: "/forgot-password",
      component: ForgotPassword,
      meta: {
        title: "forgot_password",
      },
    },
    {
      path: "/reset-password",
      component: ResetPassword,
      meta: {
        title: "reset_password",
      },
    },
    {
      path: "/about-us",
      component: AboutUs,
      meta: {
        title: "about_us",
      },
    },
    {
      path: "/admin",
      component: AdminGuilds,
      meta: {
        title: "admin_list_guilds",
      },
    },
    {
      path: "/admin/users",
      component: AdminUsers,
      meta: {
        title: "admin_list_users",
      },
    },
  ],
});

export default router;
