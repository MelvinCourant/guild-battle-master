<script setup>
import "../assets/css/views/_map.scss";
import Tabs from "../components/menus/Tabs.vue";
import { ref } from "vue";
import MapGrid from "../components/grids/MapGrid.vue";
import { useUserStore } from "../stores/user.js";

const env = import.meta.env;
const userStore = useUserStore();
const token = userStore.token;
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
const cards = ref([]);

async function getTowers() {
  const result = await fetch(`${env.VITE_URL}/api/towers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (result.ok) {
    cards.value = await result.json();
  }
}

getTowers();
</script>

<template>
  <main class="map">
    <h1 class="hidden-title">Plan de siège</h1>
    <Tabs :links="links" :tools="tools" />
    <MapGrid :cards="cards" />
  </main>
</template>
