<script setup>
import '../assets/css/views/_member.scss';
import MemberProfile from "../components/MemberProfile.vue";
import Monsters from "../components/Monsters.vue";
import {inject, provide, ref} from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../stores/user.js";

const env = import.meta.env;
const userStore = useUserStore();
const token = userStore.token;
const route = useRoute();
const params = route.params;
const memberId = parseInt(params.id);
const member = ref({});
const monsters = ref([]);
const fields = [
  {
    type: "search",
    name: "search",
    placeholder: "Nom, grade naturel, etc.",
  }
];
const loading = ref(true);

provide('monsters', monsters);
provide('fields', fields);
provide('loading', loading);

async function getMember() {
  const result = await fetch(`${env.VITE_URL}/api/members/${memberId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  if (result.ok) {
    const resultJson = await result.json();
    member.value = resultJson.member;
    monsters.value = resultJson.monsters;
  }
}

getMember();
</script>

<template>
  <main class="member">
    <MemberProfile
        :memberId="memberId"
        :pseudo="member.pseudo"
        :grade="member.grade"
        :image="member.image"
    />
    <Monsters/>
  </main>
</template>