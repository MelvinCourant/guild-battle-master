<script setup>
import Navbar from "../components/menus/Navbar.vue";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const hideNavbar = ref(true);
const route = useRoute();

watch(route, () => {
  if (
    route.path === "/login" ||
    route.path === "/register" ||
    route.path === "/forgot-password" ||
    route.path === "/reset-password"
  ) {
    hideNavbar.value = true;
  } else {
    hideNavbar.value = false;
  }

  if (route.meta.title) {
    document.head.querySelector("title").textContent =
      `Guild battle Master - ${t(route.meta.title)}`;
  } else {
    document.head.querySelector("title").textContent = "Guild battle Master";
  }
});
</script>

<template>
  <Navbar v-if="!hideNavbar" />
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<style scoped></style>
