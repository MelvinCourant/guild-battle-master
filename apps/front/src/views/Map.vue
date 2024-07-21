<script setup>
import "../assets/css/views/_map.scss";
import Tabs from "../components/menus/Tabs.vue";
import { ref } from "vue";
import MapGrid from "../components/grids/MapGrid.vue";
import { useUserStore } from "../stores/user.js";
import Dialog from "../components/utils/Dialog.vue";

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
    name: "reset",
    title: "Réinitialiser le plan",
  },
];
const cards = ref([]);
const dialog = {
  content: {
    title: "Réinitialiser le plan",
    description:
      "Toutes les défenses seront supprimées de la carte. Êtes-vous sûr de vouloir continuer ?",
  },
  fields: [
    {
      type: "button",
      name: "cancel",
      value: "Annuler",
    },
    {
      type: "button",
      name: "confirm",
      value: "Confirmer",
      style: "danger",
    },
  ],
};
const dialogIsOpen = ref(false);

async function getTowers() {
  const result = await fetch(`${env.VITE_URL}/api/towers/list`, {
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

async function resetTowers() {
  const result = await fetch(`${env.VITE_URL}/api/towers/reset`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (result.ok) {
    cards.value.forEach((card) => {
      card.defenses = [];
    });
  }
}

function toolClicked(tool) {
  if (tool.name === "reset") {
    dialogIsOpen.value = true;
  }
}

function confirmOrCancelReset(action) {
  if (action === "confirm") {
    resetTowers();
  }

  dialogIsOpen.value = false;
}
</script>

<template>
  <main class="map">
    <h1 class="hidden-title">Plan de siège</h1>
    <Tabs :links="links" :tools="tools" @toolClicked="toolClicked" />
    <MapGrid :cards="cards" />
    <Dialog
      :dialog="dialog"
      :isOpen="dialogIsOpen"
      @close="dialogIsOpen = false"
      @click="confirmOrCancelReset"
    />
  </main>
</template>
