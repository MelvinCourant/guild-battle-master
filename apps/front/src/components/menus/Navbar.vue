<script setup>
  import { useUserStore } from "../../stores/user.js";
  import '../../assets/css/components/menus/_navbar.scss';
  import { useRoute } from "vue-router";
  import logo from '../../assets/imgs/logo.svg';
  import AccountMenu from "../../components/menus/AccountMenu.vue";
  import NavbarMobile from "../../components/menus/mobile/NavbarMobile.vue";
  import { provide, ref } from "vue";

  const desktopLinks = [
    {
      name: 'Guilde',
      path: '/guild',
      selected: false
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
  const mobileLinks = [
    {
      name: 'Guilde',
      path: '/guild',
      selected: false
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
    },
    {
      name: 'Notifications',
      path: '/notifications',
      selected: false
    }
  ];
  const route = useRoute();
  const userStore = useUserStore();
  const user = userStore.user;
  const userProfile = {
    pseudo: user.pseudo,
    image: user.image,
    grade: user.grade
  }
  const submenu = [
    {
      icon: 'profile',
      text: 'Profil de membre',
      path: '/member'
    },
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
  const onMobile = ref(false);

  provide('submenu', submenu);
  provide('userProfile', userProfile);
  provide('onMobile', onMobile);

  function handleMobile() {
    if(
        window.innerWidth <= 768 &&
        !onMobile.value ||
        window.innerWidth > 768 &&
        onMobile.value
    ) {
      onMobile.value = !onMobile.value;
    }
  }

  handleMobile();
  window.addEventListener('resize', handleMobile);
</script>

<template>
  <header class="navbar">
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
        <li
            v-show="!onMobile"
            :aria-hidden="onMobile"
        >
          <ul class="navbar__center">
            <li
                v-for="desktopLink in desktopLinks"
                :key="desktopLink.name"
            >
              <router-link
                  :to="desktopLink.path"
                  class="navbar__link"
                  :class="{ 'navbar__link--selected': desktopLink.path === route.path }"
              >
                {{ desktopLink.name }}
              </router-link>
            </li>
          </ul>
        </li>
        <li
            v-show="onMobile"
            :aria-hidden="!onMobile"
        >
          <NavbarMobile :mobileLinks="mobileLinks" />
        </li>
        <li>
          <ul class="navbar__right">
            <li
                v-show="!onMobile"
                :aria-hidden="onMobile"
            >
              <button class="navbar__notifications-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M13.4998 7.85417V12.4375L15.3332 14.2708V15.1875H0.666504V14.2708L2.49984 12.4375V7.85417C2.49984 5.03083 3.994 2.68417 6.62484 2.06083V1.4375C6.62484 0.676667 7.239 0.0625 7.99984 0.0625C8.76067 0.0625 9.37484 0.676667 9.37484 1.4375V2.06083C11.9965 2.68417 13.4998 5.04 13.4998 7.85417ZM9.83317 16.1042C9.83317 16.5904 9.64002 17.0567 9.2962 17.4005C8.95238 17.7443 8.48607 17.9375 7.99984 17.9375C7.51361 17.9375 7.04729 17.7443 6.70348 17.4005C6.35966 17.0567 6.1665 16.5904 6.1665 16.1042H9.83317Z" fill="white"/>
                </svg>
              </button>
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
