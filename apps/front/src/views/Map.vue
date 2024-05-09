<script setup>
import "../assets/css/views/_map.scss";
import Tabs from "../components/menus/Tabs.vue";

const links = [
  {
    id: 1,
    name: "Plan de siège",
    path: "/map",
    selected: true,
  },
  {
    id: 2,
    name: "Défenses par membre",
    path: "/defenses-per-member",
    selected: false,
  },
];
const tools = [
  {
    name: "capture",
    title: "Faire une capture d'écran",
  },
  {
    name: "reset",
    title: "Réinitialiser le plan",
  },
];
</script>

<template>
  <main class="map">
    <h1 class="hidden-title">Plan de siège</h1>
    <Tabs :links="links" :tools="tools" />
  </main>
</template>
