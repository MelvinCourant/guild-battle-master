<script setup lang="ts">
  import Navbar from "@components/Navbar.vue";
  import { ref, watch } from "vue";
  import { useRoute } from "vue-router";

  const hideNavbar = ref(false);
  const route = useRoute();

  watch(route, () => {
    if (route.path === "/login" || route.path === "/register") {
      hideNavbar.value = true;
    } else {
      hideNavbar.value = false;
    }
  });
</script>

<template>
  <Navbar v-if="!hideNavbar"/>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<style scoped>

</style>