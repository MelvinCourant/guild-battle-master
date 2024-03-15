<script setup lang="ts">
  import '@css/components/menus/_account-menu.scss';
  import Submenu from "@components/menus/Submenu.vue";
  import SubmenuMobile from "@components/menus/mobile/SubmenuMobile.vue";
  import { ref, inject } from "vue";

  defineProps({
    userImage: {
      type: String,
    }
  });

  const submenuIsOpen = ref(false);
  const onMobile: boolean | undefined = inject('onMobile');
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
        :aria-hidden="onMobile"
        v-if="!onMobile"
    />
    <SubmenuMobile
        :isOpened="submenuIsOpen"
        @closeSubmenu="submenuIsOpen = false"
        :aria-hidden="!onMobile"
        v-else
    />
  </nav>
</template>