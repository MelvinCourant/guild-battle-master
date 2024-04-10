<script setup>
  import '../../assets/css/components/menus/_submenu.scss';
  import { inject, watch } from "vue";

  const props = defineProps({
    isOpened: {
      type: Boolean,
      default: false,
    }
  });
  const emit = defineEmits(['closeSubmenu']);

  const submenu = inject('submenu');

  function generateIconPath(icon) {
    return new URL(`../../assets/imgs/icons/${icon}.svg`, import.meta.url).href;
  }

  function closeSubmenu(event) {
    if (!(event.target).closest('.submenu')) {
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
  <nav v-show="isOpened">
    <ul class="submenu">
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
  </nav>
</template>