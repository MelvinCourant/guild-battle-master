<script setup lang="ts">
  import '@css/components/menus/_account-menu.scss';
  import Submenu from "@components/menus/Submenu.vue";
  import { ref } from "vue";

  defineProps({
    userImage: {
      type: String,
    }
  });

  const submenuIsOpen = ref(false);
</script>

<template>
  <nav class="account-menu">
    <img
        class="account-menu__avatar"
        :src="userImage"
        alt="User image"
        title="Ouvrir le menu de compte"
        @click.stop="submenuIsOpen = !submenuIsOpen"
    >
    <Submenu
        :isOpened="submenuIsOpen"
        @closeSubmenu="submenuIsOpen = false"
    />
  </nav>
</template>