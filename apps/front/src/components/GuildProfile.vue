<script setup lang="ts">
import '../assets/css/components/_guild-profile.scss';

const env = import.meta.env;

defineProps({
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
});
</script>

<template>
  <div class="guild-profile">
    <img
      :src="`${env.VITE_URL}/uploads/${image}`"
      alt="Guild Image"
      class="guild-profile__image"
    />
    <h1 class="guild-profile__name">{{ name }}</h1>
    <router-link
      to="/upload-json"
      class="guild-profile__update"
    >
      Mettre à jour
    </router-link>
  </div>
</template>