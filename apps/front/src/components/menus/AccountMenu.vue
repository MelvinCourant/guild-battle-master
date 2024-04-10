<script setup lang="ts">
  import '../../assets/css/components/menus/_account-menu.scss';
  import Submenu from "../../components/menus/Submenu.vue";
  import SubmenuMobile from "../../components/menus/mobile/SubmenuMobile.vue";
  import { ref, inject } from "vue";
  import Avatar from "../utils/Avatar.vue";

  defineProps({
    userImage: {
      type: String,
    }
  });

  const submenuIsOpen = ref(false);
  const onMobile: boolean | undefined = inject('onMobile');

  function closeSubmenuOnResize() {
    if(
        window.innerWidth <= 768 &&
        submenuIsOpen.value ||
        window.innerWidth > 768 &&
        submenuIsOpen.value
    ) {
      submenuIsOpen.value = false;
    }
  }

  window.addEventListener('resize', closeSubmenuOnResize);
</script>

<template>
  <nav class="account-menu">
    <button
        class="account-menu__button"
        title="Ouvrir le menu de compte"
        @click.stop="submenuIsOpen = !submenuIsOpen"
    >
      <Avatar
          :className="'account-menu__avatar'"
          :src="userImage"
          :alt="'User avatar'"
      />
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