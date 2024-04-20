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
  </main>
</template>