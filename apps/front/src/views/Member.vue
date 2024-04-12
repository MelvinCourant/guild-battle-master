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
    placeholder: "Nom du monstre",
  },
  {
    type: "checkbox",
    name: "is-fusion-shop",
    label: "Afficher les monstres non-invocable (fusions, Ifrits, etc.)",
    checked: true,
  }
];
const loading = ref(true);
const keyword = ref('');
const isFusionShop = ref(true);

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

async function searchMonsters(inputName, value) {
  if(inputName === 'is-fusion-shop') {
    isFusionShop.value = value;
  } else {
    keyword.value = value;
  }

  if(
      inputName === 'search' &&
      isFusionShop.value &&
      value === ''
  ) {
    await getMember();
    return;
  }

  let body;
  let filters;

  if(keyword.value) {
    body = {
      keyword: keyword.value
    };
  }

  if(!isFusionShop.value) {
    filters = {
      'is_fusion_shop': isFusionShop.value,
    };
  }

  if(filters) {
    body = {
      ...body,
      filters: filters
    };
  }

  const result = await fetch(`${env.VITE_URL}/api/boxes/${memberId.value}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  if (result.ok) {
    monsters.value = await result.json();
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
    <Monsters
        @sendValue="searchMonsters"
    />
  </main>
</template>