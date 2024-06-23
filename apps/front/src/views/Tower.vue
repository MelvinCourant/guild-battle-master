<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const params = route.params;
const id = params.id;
</script>

<template>
  <main class="tower">
    <h1>Tower</h1>
    <p>Id: {{ id }}</p>
  </main>
</template>
