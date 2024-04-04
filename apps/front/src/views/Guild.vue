<script setup lang="ts">
import Members from "../components/Members.vue";
import {provide, ref} from "vue";
import {useUserStore} from "../stores/user.ts";

const userStore = useUserStore();
const user = userStore.user;
const token = userStore.token;
const env = import.meta.env;
const columns = [
  {
    name: "",
    key: "picture",
    width: 70
  },
  {
    name: "Grade",
    key: "grade",
    width: 200
  },
  {
    name: "Pseudo",
    key: "pseudo",
    width: 220
  },
  {
    name: "5 nats lumière et ténèbre",
    key: "lds",
    width: null
  },
  {
    name: "",
    key: "actions",
    width: 55
  }
];
const data: object = ref({});

provide("columns", columns);
provide("data", data);

async function getMembers() {
  const result = await fetch(`${env.VITE_URL}/guilds/${user.guild_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (result.ok) {
    const resultJson = await result.json();
    data.value = {
      rows: resultJson.members,
      badges: ['lds']
    };
  }
}

getMembers();
</script>

<template>
  <main class="guild">
    <Members/>
  </main>
</template>