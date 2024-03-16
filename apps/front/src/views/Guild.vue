<script setup lang="ts">
  import { useUserStore } from "../stores/user.ts";

  const userStore = useUserStore();
  const user = userStore.user;
</script>

<template>
  <main>
    <h1>{{ user.pseudo }}</h1>
    <p>{{ user.email }}</p>
  </main>
</template>