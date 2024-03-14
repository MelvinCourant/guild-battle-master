<script setup lang="ts">
  import '@css/components/menus/_submenu.scss';
  import { inject, watch } from "vue";
  import { ISubmenuLink } from "@models/navbar.ts";

  const props = defineProps({
    isOpened: {
      type: Boolean,
      default: false,
    }
  });
  const emit = defineEmits(['closeSubmenu']);

  const submenu: Array<ISubmenuLink> | undefined = inject('submenu');

  function generateIconPath(icon: string): string {
    return new URL(`../../assets/imgs/icons/${icon}.svg`, import.meta.url).href;
  }

  function closeSubmenu(event: Event) {
    if (!(event.target as HTMLElement).closest('.submenu')) {
      emit('closeSubmenu');
      document.removeEventListener('click', closeSubmenu);
    }
  }

  watch(() => props.isOpened, (isOpened) => {
    if (isOpened) {
      document.addEventListener('click', closeSubmenu);
    } else {
      document.removeEventListener('click', closeSubmenu);
    }
  });
</script>

<template>
  <ul
      class="submenu"
      v-show="isOpened"
  >
    <li
        v-for="(link, index) in submenu"
        :key="index"
    >
      <router-link
          :to="link.path"
          class="submenu__link"
          @click="$emit('closeSubmenu')"
      >
        <div class="submenu__icon">
          <img
              :src="generateIconPath(link.icon)"
              alt="link.icon"
          />
        </div>
        <span class="submenu__text">
          {{ link.text }}
        </span>
      </router-link>
    </li>
  </ul>
</template>