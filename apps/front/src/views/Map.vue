<script setup>
import "../assets/css/views/_map.scss";
import Tabs from "../components/menus/Tabs.vue";
import { ref } from "vue";
import MapGrid from "../components/grids/MapGrid.vue";

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
const cards = ref([
  {
    id: 1,
    position: 1,
    defenses: [
      {
        members: {
          pseudo: "John Doe / Jane Doe / Foo Bar",
        },
        leader: {
          image: "monsters/unit_icon_0037_4_1.png",
          unit_master_id: 20115,
        },
        second: {
          image: "monsters/unit_icon_0037_4_1.png",
          unit_master_id: 20115,
        },
        third: {
          image: "monsters/unit_icon_0037_4_1.png",
          unit_master_id: 20115,
        },
      },
      {
        members: {
          pseudo: "John Doe",
        },
        leader: {
          image: "monsters/unit_icon_0053_0_1.png",
          unit_master_id: 14031,
        },
        second: {
          image: "monsters/unit_icon_0053_0_1.png",
          unit_master_id: 14031,
        },
        third: {
          image: "monsters/unit_icon_0053_0_1.png",
          unit_master_id: 14031,
        },
      },
    ],
  },
]);
</script>

<template>
  <main class="map">
    <h1 class="hidden-title">Plan de siège</h1>
    <Tabs :links="links" :tools="tools" />
    <MapGrid :cards="cards" />
  </main>
</template>
