<script setup>
import '../assets/css/components/_guild-profile.scss';
import {ref} from 'vue';
import "vue3-loading-skeleton/dist/style.css";
import { SkeletonLoader } from "vue3-loading-skeleton";
import { useUserStore } from "../stores/user.js";
import Avatar from "./utils/Avatar.vue";

const userStore = useUserStore();
const user = userStore.user;

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
    <Avatar
      :src="image"
      :alt="name"
      :class="'guild-profile__image'"
      @load="onImageLoad"
      v-show="
        imageLoaded &&
        name
      "
      v-if="image"
    />
    <SkeletonLoader
        circle
        size="100"
        class="guild-profile__skeleton-image"
        v-if="!imageLoaded"
    />

    <h1
        class="guild-profile__name"
        v-if="
          imageLoaded &&
          name
        "
    >
      {{ name }}
    </h1>
    <SkeletonLoader
        width="100"
        height="20"
        class="guild-profile__skeleton-name"
        v-else
    />
    <router-link
      to="/upload-json/guild"
      class="guild-profile__update"
      v-if="
          imageLoaded && name && user.role === 'leader' ||
          imageLoaded && name && user.role === 'moderator'
      "
    >
      Mettre à jour
    </router-link>
    <SkeletonLoader
        width="90"
        height="12"
        class="guild-profile__skeleton-update"
        v-if="
          !imageLoaded && name && user.role === 'leader' ||
          !imageLoaded && name && user.role === 'moderator'
        "
    />
  </div>
</template>