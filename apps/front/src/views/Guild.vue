<script setup>
import '../assets/css/views/_guild.scss';
import {provide, reactive, ref} from "vue";
import {useUserStore} from "../stores/user.js";
import GuildProfile from "../components/GuildProfile.vue";
import Dialog from "../components/utils/Dialog.vue";
import Alert from "../components/utils/Alert.vue";
import TableGrid from "../components/utils/TableGrid.vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const user = userStore.user;
const token = userStore.token;
const env = import.meta.env;
const fields = [
  {
    type: "search",
    name: "search",
    placeholder: "Grade, pseudo, etc.",
  }
];
const columns = reactive([
  {
    name: '',
    key: 'picture',
    class: 'table-grid__picture'
  },
  {
    name: 'Pseudo',
    key: 'pseudo',
    class: 'table-grid__pseudo',
    sortOrder: ''
  },
  {
    name: 'Grade',
    key: 'grade',
    class: 'table-grid__grade',
    sortOrder: 'asc'
  },
  {
    name: 'Rôle',
    key: 'role',
    class: 'table-grid__role',
    sortOrder: ''
  },
  {
    name: '5 nats lds',
    key: 'lds',
    class: 'table-grid__lds',
    sortOrder: ''
  },
  {
    name: '',
    key: 'actions',
    class: 'table__actions'
  }
]);
const sortOptions = [
  {
    value: 'pseudo',
    text: 'Pseudo'
  },
  {
    value: 'grade',
    text: 'Grade'
  },
  {
    value: 'role',
    text: 'Rôle'
  },
  {
    value: 'lds',
    text: '5 nats lds'
  }
];
const actualSort = ref('grade');
const data = ref({});
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
    name: 'role',
    label: 'Attribuer un rôle',
    permissions: [
      {
        role: 'leader',
        canModify: ['all']
      },
      {
        role: 'moderator',
        canModify: ['']
      }
    ],
    danger: false
  },
  {
    name: 'exclude',
    label: 'Exclure',
    permissions: [
      {
        role: 'leader',
        canModify: ['all']
      },
      {
        role: 'moderator',
        canModify: ['']
      }
    ],
    danger: true
  }
];
const members = ref([]);
const memberSelected = ref({});
const guild = ref({});
const dialog = reactive({
  image: {
    src: '',
    alt: ''
  },
  content: {
    title: '',
    description: ''
  },
  fields: [
    {
      type: 'button',
      name: 'cancel',
      value: 'Annuler',
    },
    {
      type: 'button',
      name: 'exclude',
      value: 'Exclure',
      style: 'danger'
    }
  ]
});
const dialogIsOpen = ref(false);
const alert = reactive({
  display: false,
  type: '',
  message: '',
});
const loading = ref(true);
const router = useRouter();

provide('fields', fields);
provide('columns', columns);
provide('sortOptions', sortOptions);
provide('sortValue', actualSort);
provide('data', data);
provide('loading', loading);

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
      actions: actions
    };
    members.value = resultJson.members;
    guild.value = resultJson.guild;
    loading.value = false;
  }
}

getMembers();

function sort(key) {
  function ascendingSort(a, b) {
    if (a[key] < b[key]) {
      return -1;
    }
    if (a[key] > b[key]) {
      return 1;
    }
    return 0;
  }

  function toggleSortOrder(columns) {
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

    members.value = members.value.sort((a, b) => {
      return gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade);
    });
    actualSort.value = key;
  } else {
    members.value = members.value.sort(ascendingSort);
    actualSort.value = key;
  }

  toggleSortOrder(columns);
}

function actionSelected(selection) {
  const action = selection.action;
  const memberId = selection.id;

  if (action === 'update') {
    router.push(`/upload-json/${memberId}`);
  } else if (action === 'exclude') {
    memberSelected.value = members.value.find((member) => member.id === memberId);

    dialog.image = {
      src: memberSelected.value.image,
      alt: memberSelected.value.pseudo
    };
    dialog.content = {
      title: `Exclure ${memberSelected.value.pseudo} de la guilde ?`,
      description: 'Cet utilisateur ne sera plus membre de votre guilde. Cependant il ne sera pas exclu définitivement s’il est encore membre de votre guilde en jeu.'
    };
    dialogIsOpen.value = true;
  }
}

async function dialogResponse(name) {
  if(name === 'exclude') {
    const result = await fetch(`${env.VITE_URL}/api/members/${memberSelected.value.id}/exclude`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const resultJson = await result.json();

    if(result.ok) {
      await getMembers();
      closeDialog();
      alert.display = true;
      alert.type = 'success';
      alert.message = resultJson.message;
    } else {
      alert.display = true;
      alert.type = 'error';
      alert.message = resultJson.error;
    }
  } else {
    closeDialog();
  }
}

function closeDialog() {
  dialogIsOpen.value = false;
}

async function madeSearch(inputName, value) {
  if(value === '') {
    await getMembers();
    return;
  }

  const result = await fetch(`${env.VITE_URL}/api/guilds/${user.guild_id}/members/${value}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  if(result.ok) {
    const resultJson = await result.json();
    data.value = {
      rows: resultJson.members,
      badges: ['lds'],
      actions: actions
    };
    members.value = resultJson.members;
    actualSort.value = 'grade';

    columns.forEach((column) => {
      if(column.key === actualSort.value) {
        column.sortOrder = 'asc';
      } else {
        column.sortOrder = '';
      }
    });
  }
}

function sortGrid(key) {
  sort(key);
  actualSort.value = key;
}
</script>

<template>
  <main class="guild">
    <GuildProfile
      :name="guild.name"
      :image="guild.image"
    />
    <TableGrid
      @sort="sort"
      @actionSelected="actionSelected"
      @sendValue="madeSearch"
      @sortGrid="sortGrid"
    />
  </main>
  <Dialog
    :dialog="dialog"
    :isOpen="dialogIsOpen"
    @click="dialogResponse"
    @close="closeDialog"
  />
  <Alert
    :display="alert.display"
    :type="alert.type"
    :message="alert.message"
  />
</template>