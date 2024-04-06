<script setup lang="ts">
import '../assets/css/views/_guild.scss';
import Members from "../components/Members.vue";
import {provide, reactive, ref} from "vue";
import {useUserStore} from "../stores/user.ts";
import GuildProfile from "../components/GuildProfile.vue";

const userStore = useUserStore();
const user = userStore.user;
const token = userStore.token;
const env = import.meta.env;
const columns = reactive([
  {
    name: '',
    key: 'picture',
    class: 'members__picture'
  },
  {
    name: 'Pseudo',
    key: 'pseudo',
    class: 'members__pseudo',
    sortOrder: ''
  },
  {
    name: 'Grade',
    key: 'grade',
    class: 'members__grade',
    sortOrder: ''
  },
  {
    name: '5 nats lumière et ténèbre',
    key: 'lds',
    class: 'members__lds',
    sortOrder: ''
  },
  {
    name: '',
    key: 'actions',
    class: 'table__actions'
  }
]);
const data = ref({});
const members = ref([]);
const guild = ref({});

provide('columns', columns);
provide('data', data);

async function getMembers() {
  const result = await fetch(`${env.VITE_URL}/api/guilds/${user.guild_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  if (result.ok) {
    const resultJson = await result.json();
    data.value = {
      rows: resultJson.members,
      badges: ['lds'],
      actions: [
        {
          name: 'update',
          label: 'Mettre à jour',
          danger: false
        },
        {
          name: 'exclude',
          label: 'Exclure',
          danger: true
        }
      ]
    };
    members.value = resultJson.members;
    guild.value = resultJson.guild;
  }
}

getMembers();

const actualSort = ref('');

function sort(key: string) {
  function ascendingSort(a: any, b: any) {
    if (a[key] < b[key]) {
      return -1;
    }
    if (a[key] > b[key]) {
      return 1;
    }
    return 0;
  }

  function toggleSortOrder(columns: any) {
    columns.forEach((column) => {
      if (
          column.key === key &&
          column.sortOrder === '' ||
          column.key === key &&
          column.sortOrder === 'desc'
      ) {
        column.sortOrder = 'asc';
      } else if (
          column.key === key &&
          column.sortOrder === 'asc'
      ) {
        column.sortOrder = 'desc';
      } else {
        column.sortOrder = '';
      }
    });
  }

  if(
    key === 'picture' ||
    key === 'actions'
  ) {
    return;
  } else if (actualSort.value === key) {
    members.value = members.value.reverse();
  } else if(key === 'grade') {
    const gradeOrder = ['leader', 'vice-leader', 'senior', 'member'];

    members.value = members.value.sort((a: any, b: any) => {
      return gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade);
    });
    actualSort.value = key;
  } else {
    members.value = members.value.sort(ascendingSort);
    actualSort.value = key;
  }

  toggleSortOrder(columns);
}

function actionSelected(selection: any) {
  const action = selection.action;
  const memberId = selection.id;

  if (action === 'update') {
    console.log('update', memberId);
  } else if (action === 'exclude') {
    console.log('exclude', memberId);
  }
}
</script>

<template>
  <main class="guild">
    <GuildProfile
      :name="guild.name"
      :image="guild.image"
    />
    <Members
      @sort="sort"
      @actionSelected="actionSelected"
    />
  </main>
</template>