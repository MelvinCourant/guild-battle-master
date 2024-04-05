<script setup lang="ts">
import '../assets/css/components/_guild-profile.scss';
import {ref} from 'vue';
import "vue3-loading-skeleton/dist/style.css";
import { SkeletonLoader } from "vue3-loading-skeleton";

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

const imageLoaded = ref(false);

function onImageLoad() {
  imageLoaded.value = true;
}
</script>

<template>
  <div class="guild-profile">
    <img
      :src="`${env.VITE_URL}/uploads/${image}`"
      alt="Guild Image"
      class="guild-profile__image"
      @load="onImageLoad"
      v-show="imageLoaded"
    />
    <SkeletonLoader
        circle
        size="100"
        v-if="!imageLoaded"
    />

    <h1
        class="guild-profile__name"
        v-if="name"
    >
      {{ name }}
    </h1>
    <SkeletonLoader
        width="100"
        height="20"
        v-else
    />
    <router-link
      to="/upload-json"
      class="guild-profile__update"
    >
      Mettre à jour
    </router-link>
  </div>
</template>