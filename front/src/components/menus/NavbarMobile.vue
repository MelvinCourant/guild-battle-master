<script setup lang="ts">
  import '@css/components/menus/_navbar-mobile.scss';
  import type { ILink } from "@models/navbar.js";
  import { PropType } from "vue";
  import { useRoute } from "vue-router";

  const route = useRoute();

  defineProps({
    mobileLinks: {
      type: Array as PropType<Array<ILink>>,
      required: true
    }
  });
</script>

<template>
  <ul class="navbar-mobile">
    <li
        v-for="mobileLink in mobileLinks"
        :key="mobileLink.name"
        class="navbar-mobile__item"
    >
      <router-link
          :to="mobileLink.path"
          class="navbar-mobile__link"
          :class="{ 'navbar-mobile__link--selected': mobileLink.path === route.path }"
      >
        <svg
            v-if="mobileLink.path === '/guild'"
            xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none"
        >
          <path d="M11.1945 0.5H2.30561C1.32783 0.5 0.527832 1.3 0.527832 2.27778V16.5L6.75005 13.8333L12.9723 16.5V2.27778C12.9723 1.3 12.1723 0.5 11.1945 0.5Z" fill="var(--white)"/>
        </svg>
        <svg
            v-if="mobileLink.path === '/map'"
            xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none"
        >
          <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5475 0.65125L15.6875 0.625C15.9325 0.625 16.125 0.8175 16.125 1.0625V14.2925C16.125 14.4938 15.9937 14.6512 15.81 14.7125L10.875 16.375L5.625 14.5375L0.9525 16.3487L0.8125 16.375C0.5675 16.375 0.375 16.1825 0.375 15.9375V2.7075C0.375 2.50625 0.50625 2.34875 0.69 2.2875L5.625 0.625L10.875 2.4625L15.5475 0.65125ZM5.625 12.6825L10.875 14.5287V4.3175L5.625 2.47125V12.6825Z" fill="var(--white)"/>
        </svg>
        <svg
            v-if="mobileLink.path === '/defenses'"
            xmlns="http://www.w3.org/2000/svg" width="15" height="19" viewBox="0 0 15 19" fill="none"
        >
          <path d="M7.75 0.75L0.75 3.375V8.70375C0.75 13.1225 3.73375 17.2437 7.75 18.25C11.7663 17.2437 14.75 13.1225 14.75 8.70375V3.375L7.75 0.75Z" fill="var(--white)"/>
        </svg>
        <svg
            v-if="mobileLink.path === '/notifications'"
            xmlns="http://www.w3.org/2000/svg" width="14" height="17" viewBox="0 0 14 17" fill="none"
        >
          <path fill-rule="evenodd" clip-rule="evenodd" d="M11.875 7.47436V11.5769L13.5 13.2179V14.0385H0.5V13.2179L2.125 11.5769V7.47436C2.125 4.94718 3.44938 2.84667 5.78125 2.28872V1.73077C5.78125 1.04974 6.32562 0.5 7 0.5C7.67438 0.5 8.21875 1.04974 8.21875 1.73077V2.28872C10.5425 2.84667 11.875 4.95538 11.875 7.47436ZM8.625 14.859C8.625 15.2942 8.45379 15.7116 8.14905 16.0194C7.8443 16.3271 7.43098 16.5 7 16.5C6.56902 16.5 6.1557 16.3271 5.85095 16.0194C5.54621 15.7116 5.375 15.2942 5.375 14.859H8.625Z" fill="white"/>
        </svg>
        {{ mobileLink.name }}
      </router-link>
    </li>
  </ul>
</template>