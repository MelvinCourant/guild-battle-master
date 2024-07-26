<script setup>
import "../assets/css/components/_guild-profile.scss";
import { ref } from "vue";
import "vue3-loading-skeleton/dist/style.css";
import { SkeletonLoader } from "vue3-loading-skeleton";
import { useUserStore } from "../stores/user.js";
import Avatar from "./utils/Avatar.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStore();
const user = userStore.user;

defineProps({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const imageLoaded = ref(false);
</script>

<template>
  <div class="guild-profile">
    <Avatar
      :src="image"
      :alt="name"
      :className="'guild-profile__image'"
      @load="imageLoaded = true"
      v-show="imageLoaded && name"
    />

    <h1 class="guild-profile__name" v-if="imageLoaded && name">
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
        (imageLoaded && name && user.role === 'leader') ||
        (imageLoaded && name && user.role === 'moderator')
      "
    >
      {{ t("update") }}
    </router-link>
    <SkeletonLoader
      width="90"
      height="12"
      class="guild-profile__skeleton-update"
      v-if="
        (!imageLoaded && name && user.role === 'leader') ||
        (!imageLoaded && name && user.role === 'moderator')
      "
    />
  </div>
</template>
