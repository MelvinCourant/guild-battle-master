<script setup>
import "../assets/css/views/_tower.scss";
import { useRoute } from "vue-router";
import { useUserStore } from "../stores/user.js";
import { provide, ref } from "vue";
import GuildCompositions from "../components/GuildCompositions.vue";

const route = useRoute();
const params = route.params;
const id = params.id;
const env = import.meta.env;
const userStore = useUserStore();
const token = userStore.token;
const user = userStore.user;
const guildId = user.guild_id;
const tower = ref({});
const compositions = ref([]);
const fields = [
  {
    type: "search",
    name: "search",
    placeholder: "Nom d'une composition",
  },
];
const body = ref({});
const filters = ref({});
const keyword = ref("");

provide("fields", fields);

async function getTower() {
  const result = await fetch(`${env.VITE_URL}/api/towers/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (result.ok) {
    tower.value = await result.json();
    await getCompositions();
  }
}

getTower();

async function getCompositions() {
  if (tower.value.grade === "5") {
    filters.value = {
      "4_stars": false,
    };
  } else {
    filters.value = {
      "5_stars": false,
    };
  }

  body.value = {
    filters: filters.value,
  };

  const result = await fetch(
    `${env.VITE_URL}/api/compositions/${guildId}/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body.value),
    },
  );

  if (result.ok) {
    compositions.value = await result.json();
  }
}

async function searchComposition(inputName, value) {
  if (inputName === "search") {
    keyword.value = value;
  }

  if (keyword.value) {
    body.value = {
      keyword: keyword.value,
      filters: filters.value,
    };
  } else {
    body.value = {
      filters: filters.value,
    };
  }

  const result = await fetch(
    `${env.VITE_URL}/api/compositions/${guildId}/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body.value),
    },
  );

  if (result.ok) {
    compositions.value = await result.json();
  }
}
</script>

<template>
  <main class="tower">
    <GuildCompositions
      :compositions="compositions"
      @search="searchComposition"
    />
  </main>
</template>
