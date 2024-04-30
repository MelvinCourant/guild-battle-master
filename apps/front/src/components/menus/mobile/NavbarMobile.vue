<script setup>
import '../../../assets/css/components/menus/mobile/_navbar-mobile.scss';
import { useRoute } from "vue-router";

const route = useRoute();

defineProps({
  mobileLinks: {
    type: Array,
    required: true
  },
  notifications: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <nav>
    <ul class="navbar-mobile">
      <li
          v-for="mobileLink in mobileLinks"
          :key="mobileLink.name"
          class="navbar-mobile__item"
      >
        <router-link
            :to="mobileLink.path"
            :class="[
                'navbar-mobile__link',
              { 'navbar-mobile__link--selected': mobileLink.path === route.path },
              { 'navbar-mobile__link--unread': mobileLink.path === '/notifications' && notifications[0] && !notifications[0].isRead > 0}
            ]"
        >
          <svg
              v-if="mobileLink.path === '/guild'"
              xmlns="http://www.w3.org/2000/svg" width="18" height="23" viewBox="0 0 18 23" fill="none">
            <path d="M14.861 0.5H2.63878C1.29434 0.5 0.194336 1.6 0.194336 2.94444V22.5L8.74989 18.8333L17.3054 22.5V2.94444C17.3054 1.6 16.2054 0.5 14.861 0.5Z" fill="var(--white)"
            />
          </svg>
          <svg
              v-if="mobileLink.path === '/map'"
              xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M21.4433 0.536667L21.6389 0.5C21.9811 0.5 22.25 0.768889 22.25 1.11111V19.5911C22.25 19.8722 22.0667 20.0922 21.81 20.1778L14.9167 22.5L7.58333 19.9333L1.05667 22.4633L0.861111 22.5C0.518889 22.5 0.25 22.2311 0.25 21.8889V3.40889C0.25 3.12778 0.433333 2.90778 0.69 2.82222L7.58333 0.5L14.9167 3.06667L21.4433 0.536667ZM7.58333 17.3422L14.9167 19.9211V5.65778L7.58333 3.07889V17.3422Z" fill="var(--white)"/>
          </svg>
          <svg
              v-if="mobileLink.path === '/defenses'"
              xmlns="http://www.w3.org/2000/svg" width="19" height="23" viewBox="0 0 19 23" fill="none"
          >
            <path d="M9.74995 0.5L0.949951 3.8V10.499C0.949951 16.054 4.70095 21.235 9.74995 22.5C14.799 21.235 18.55 16.054 18.55 10.499V3.8L9.74995 0.5Z" fill="var(--white)"/>
          </svg>
          <svg
              v-if="mobileLink.path === '/notifications'"
              xmlns="http://www.w3.org/2000/svg" width="19" height="23" viewBox="0 0 19 23" fill="none"
          >
            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9531 10.0897V15.7308L18.1875 17.9872V19.1154H0.3125V17.9872L2.54688 15.7308V10.0897C2.54688 6.61487 4.36789 3.72667 7.57422 2.95949V2.19231C7.57422 1.2559 8.32273 0.5 9.25 0.5C10.1773 0.5 10.9258 1.2559 10.9258 2.19231V2.95949C14.1209 3.72667 15.9531 6.62615 15.9531 10.0897ZM11.4844 20.2436C11.4844 20.842 11.249 21.416 10.8299 21.8391C10.4109 22.2623 9.84259 22.5 9.25 22.5C8.65741 22.5 8.08909 22.2623 7.67006 21.8391C7.25103 21.416 7.01562 20.842 7.01562 20.2436H11.4844Z" fill="var(--white)"/>
          </svg>
          {{ mobileLink.name }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>