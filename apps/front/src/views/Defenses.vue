<script setup>
import '../assets/css/views/_defenses.scss';
import GuildCompositions from "../components/GuildCompositions.vue";
import {useUserStore} from "../stores/user.js";
import {provide, ref} from 'vue';

const env = import.meta.env;
const userStore = useUserStore();
const user = userStore.user;
const guildId = user.guild_id;
const token = userStore.token;
const fields = [
  {
    type: "search",
    name: "search",
    placeholder: "Composition, monstre, .etc",
  }
];
const keyword = ref('');
const compositions = ref([]);
const actions = [
  {
    name: 'update',
    label: 'Mettre à jour',
    permissions: [
      {
        role: 'leader',
        canModify: ['all']
      },
      {
        role: 'moderator',
        canModify: ['all']
      }
    ],
    danger: false
  },
  {
    name: 'delete',
    label: 'Supprimer',
    permissions: [
      {
        role: 'leader',
        canModify: ['all']
      },
      {
        role: 'moderator',
        canModify: ['all']
      }
    ],
    danger: true
  }
];

provide("fields", fields);

const loading = ref(false);

async function getAllCompositions() {
  loading.value = true;

  const result = await fetch(`${env.VITE_URL}/api/compositions/${guildId}/search`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  );

  if (result.ok) {
    loading.value = false;
    compositions.value = await result.json();
  } else {
    loading.value = false;
  }
}

getAllCompositions();
</script>

<template>
  <main class="defenses">
    <GuildCompositions
      :compositions="compositions"
      :actions="actions"
      :loading="loading"
    />
    <router-link
        to="/composition"
        title="Ajouter une composition"
        class="defenses__add-composition"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.8235 10.2605H10.2605V17.8235H7.73948V10.2605H0.176453V7.7395H7.73948V0.176472H10.2605V7.7395H17.8235V10.2605Z" fill="var(--white)"/>
      </svg>
    </router-link>
  </main>
</template>