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

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Guild,
      meta: {
        title: "Guilde",
      },
    },
    {
      path: "/map",
      component: Map,
      meta: {
        title: "Plan de siège",
      },
    },
    {
      path: "/defenses",
      component: Defenses,
      meta: {
        title: "Défenses",
      },
    },
    {
      path: "/login",
      component: Login,
      meta: {
        title: "Connexion",
      },
    },
    {
      path: "/register",
      component: Register,
      meta: {
        title: "Inscription",
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
        title: "Importer un JSON",
      },
    },
    {
      path: "/upload-json/guild",
      component: UploadJson,
      meta: {
        title: "Importer un JSON",
      },
    },
    {
      path: "/member",
      component: Member,
      meta: {
        title: "Membre",
      },
    },
    {
      path: "/member/:id",
      component: Member,
      meta: {
        title: "Membre",
      },
    },
    {
      path: "/composition",
      component: Composition,
      meta: {
        title: "Ajouter une composition",
      },
    },
    {
      path: "/composition/:id",
      component: Composition,
      meta: {
        title: "Modifier une composition",
      },
    },
    {
      path: "/notifications",
      component: Notifications,
      meta: {
        title: "Notifications",
      },
    },
    {
      path: "/tower/:id",
      component: Tower,
      meta: {
        title: "Modifier une tour",
      },
    },
    {
      path: "/defenses-per-member",
      component: DefensesPerMember,
      meta: {
        title: "Défenses par membre",
      },
    },
    {
      path: "/forgot-password",
      component: ForgotPassword,
      meta: {
        title: "Mot de passe oublié",
      },
    },
    {
      path: "/reset-password",
      component: ResetPassword,
      meta: {
        title: "Réinitialiser le mot de passe",
      },
    },
    {
      path: "/about-us",
      component: AboutUs,
      meta: {
        title: "À propos",
      },
    },
  ],
});

export default router;
