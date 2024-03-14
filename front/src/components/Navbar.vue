<script setup lang="ts">
  import { useUserStore } from "@stores/user.ts";
  import '@css/components/_navbar.scss';
  import { useRoute } from "vue-router";
  import logo from '@imgs/logo.svg';
  import type { ILink } from "@models/navbar.ts";
  import AccountMenu from "@components/menus/AccountMenu.vue";
  import { provide } from "vue";

  const links: Array<ILink> = [
    {
      name: 'Guilde',
      path: '/guild',
      selected: true
    },
    {
      name: 'Plan de siège',
      path: '/map',
      selected: false
    },
    {
      name: 'Défenses',
      path: '/defenses',
      selected: false
    }
  ];
  const route = useRoute();
  const userStore = useUserStore();
  const user = userStore.user;
  const submenu = [
    {
      icon: 'settings',
      text: 'Paramètres',
      path: '/settings'
    },
    {
      icon: 'upload',
      text: 'Importer un json',
      path: '/upload-json'
    },
    {
      icon: 'information',
      text: 'À propos',
      path: '/about'
    },
    {
      icon: 'logout',
      text: 'Se déconnecter',
      path: '/logout'
    }
  ];

  provide('submenu', submenu);
</script>

<template>
  <header
      class="navbar"
      v-if="userStore.isLogged"
  >
    <nav class="navbar__nav">
      <ul class="navbar__list">
        <li class="navbar__left">
          <router-link to="/" title="Aller à l'accueil">
            <img
                class="navbar__logo"
                :src="logo"
                alt="Guild battle Master logo"
            >
          </router-link>
          <router-link to="/" class="navbar__gbm">Guild battle Master</router-link>
        </li>
        <li>
          <ul class="navbar__center">
            <li
                v-for="link in links"
                :key="link.name"
            >
              <router-link
                  :to="link.path"
                  class="navbar__link"
                  :class="{ 'navbar__link--selected': link.path === route.path }"
              >
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </li>
        <li>
          <ul class="navbar__right">
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.4998 7.85417V12.4375L15.3332 14.2708V15.1875H0.666504V14.2708L2.49984 12.4375V7.85417C2.49984 5.03083 3.994 2.68417 6.62484 2.06083V1.4375C6.62484 0.676667 7.239 0.0625 7.99984 0.0625C8.76067 0.0625 9.37484 0.676667 9.37484 1.4375V2.06083C11.9965 2.68417 13.4998 5.04 13.4998 7.85417ZM9.83317 16.1042C9.83317 16.5904 9.64002 17.0567 9.2962 17.4005C8.95238 17.7443 8.48607 17.9375 7.99984 17.9375C7.51361 17.9375 7.04729 17.7443 6.70348 17.4005C6.35966 17.0567 6.1665 16.5904 6.1665 16.1042H9.83317Z" fill="white"/>
              </svg>
            </li>
            <li>
              <AccountMenu :userImage="user.image" />
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </header>
</template>
