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
    <button
        class="account-menu__button"
        title="Ouvrir le menu de compte"
        @click.stop="submenuIsOpen = !submenuIsOpen"
    >
      <img
          class="account-menu__avatar"
          :src="userImage"
          alt="User image"
      >
    </button>
    <Submenu
        :isOpened="submenuIsOpen"
        @closeSubmenu="submenuIsOpen = false"
    />
  </nav>
</template>