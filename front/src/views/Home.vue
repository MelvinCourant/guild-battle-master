<script setup lang="ts">
  import { useUserStore } from "@stores/user.ts";

  const store = useUserStore();
  const user = store.user;
</script>

<template>
  <h1>{{ user.pseudo }}</h1>
  <p>{{ user.email }}</p>
  <img :src="user.image" alt="User image" width="100">
</template>