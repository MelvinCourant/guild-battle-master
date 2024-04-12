<script setup>
import '../assets/css/views/_member.scss';
import MemberProfile from "../components/MemberProfile.vue";
import Monsters from "../components/Monsters.vue";
import {provide, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import { useUserStore } from "../stores/user.js";

const env = import.meta.env;
const userStore = useUserStore();
const token = userStore.token;
const user = userStore.user;
const memberId = ref(user.member_id);
const route = useRoute();
const params = route.params;
const id = parseInt(params.id);
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

function initPage() {
  if(
      id &&
      memberId.value !== id
  ) {
    memberId.value = id;
  } else if(
      id &&
      memberId.value === id
  ) {
    memberId.value = user.member_id;
  }

  getMember();
}

initPage();

watch(() => route.path, () => {
  initPage();
});

async function getMember() {
  const result = await fetch(`${env.VITE_URL}/api/members/${memberId.value}`, {
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
    loading.value = false;
  }
}
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