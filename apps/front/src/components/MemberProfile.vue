<script setup>
import '../assets/css/components/_member-profile.scss';
import {ref} from 'vue';
import "vue3-loading-skeleton/dist/style.css";
import { SkeletonLoader } from "vue3-loading-skeleton";
import { useUserStore } from "../stores/user.js";
import Avatar from "./utils/Avatar.vue";
import Grade from "./utils/Grade.vue";

const userStore = useUserStore();
const user = userStore.user;

defineProps({
    memberId: {
      type: Number,
      required: true
    },
    pseudo: {
      type: String,
      required: true
    },
    grade: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
});

const imageLoaded = ref(false);
</script>

<template>
  <div class="member-profile">
    <Avatar
      :src="image"
      :alt="pseudo"
      :className="'member-profile__image'"
      @load="imageLoaded = true"
      v-show="
        imageLoaded &&
        pseudo
      "
    />

    <h1
        class="member-profile__pseudo"
        v-if="
          imageLoaded &&
          pseudo
        "
    >
      {{ pseudo }}
    </h1>
    <SkeletonLoader
        width="100"
        height="20"
        class="member-profile__skeleton-pseudo"
        v-else
    />

    <div
        class="member-profile__grade"
        v-if="
          grade !== 'member' &&
          imageLoaded &&
          pseudo
        "
    >
      <Grade :grade="grade"/>
      {{ grade }}
    </div>
    <router-link
      :to="`/upload-json/${memberId}`"
      class="member-profile__update"
      v-if="
          imageLoaded && pseudo && user.role === 'leader' ||
          imageLoaded && pseudo && user.role === 'moderator' ||
          imageLoaded && pseudo && user.member_id === memberId
      "
    >
      Mettre à jour
    </router-link>
    <SkeletonLoader
        width="90"
        height="12"
        v-if="
          !imageLoaded && pseudo && user.role === 'leader' ||
          !imageLoaded && pseudo && user.role === 'moderator' ||
          !imageLoaded && pseudo && user.member_id === memberId
      "
    />
  </div>
</template>