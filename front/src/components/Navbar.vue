<script setup lang="ts">
  import { useUserStore } from "@stores/user.ts";

  const userStore = useUserStore();
</script>

<template>
  <header>
    <nav>
      <ul>
        <li
          v-if="userStore.isLogged"
        >
          <router-link to="/">Home</router-link>
        </li>
        <li
          v-if="!userStore.isLogged"
        >
          <router-link to="/login">Login</router-link>
        </li>
        <li
          v-if="!userStore.isLogged"
        >
          <router-link to="/register">Register</router-link>
        </li>
        <li
          v-if="userStore.isLogged"
        >
          <router-link to="/logout">Logout</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>
