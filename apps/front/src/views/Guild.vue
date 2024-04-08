<script setup lang="ts">
import '../assets/css/views/_guild.scss';
import Members from "../components/Members.vue";
import {provide, reactive, ref} from "vue";
import {useUserStore} from "../stores/user.ts";
import GuildProfile from "../components/GuildProfile.vue";
import Dialog from "../components/utils/Dialog.vue";
import Alert from "../components/utils/Alert.vue";
import {IAlert} from "../models/alert.ts";

const userStore = useUserStore();
const user = userStore.user;
const token = userStore.token;
const env = import.meta.env;
const fields = [
  {
    type: "search",
    name: "search",
    placeholder: "Grade, pseudo ou ld",
  }
];
const displayModes = reactive([
  {
    name: 'list',
    isSelected: true
  },
  {
    name: 'grid',
    isSelected: false
  }
]);
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
    sortOrder: 'asc'
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
const alert: IAlert = reactive({
  display: false,
  type: '',
  message: '',
});
const loading = ref(true);

provide('fields', fields);
provide('displayModes', displayModes);
provide('columns', columns);
provide('data', data);
provide('loading', loading)

if(window.innerWidth <= 768) {
  displayModes[0].isSelected = false;
  displayModes[1].isSelected = true;
}

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
    loading.value = false;
  }
}

getMembers();

const actualSort = ref('grade');

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

function placeholderSrc() {
  return new URL('../assets/imgs/placeholder.jpg', import.meta.url).href;
}

function actionSelected(selection: any) {
  const action = selection.action;
  const memberId = selection.id;

  if (action === 'update') {
    console.log('update', memberId);
  } else if (action === 'exclude') {
    let memberImage;

    memberSelected.value = members.value.find((member) => member.id === memberId);

    if(memberSelected.value.image === 'placeholder.jpg') {
      memberImage = placeholderSrc();
    } else {
      memberImage = `${env.VITE_URL}/uploads/${memberSelected.value.image}`;
    }

    dialog.image = {
      src: memberImage,
      alt: memberSelected.value.pseudo
    };
    dialog.content = {
      title: `Exclure ${memberSelected.value.pseudo} de la guilde ?`,
      description: 'Cet utilisateur ne sera plus membre de votre guilde. Cependant il ne sera pas exclu définitivement s’il est encore membre de votre guilde en jeu.'
    };
    dialogIsOpen.value = true;
  }
}

async function dialogResponse(name: string) {
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

    setTimeout(() => {
      alert.display = false;
    }, 3000);
  } else {
    closeDialog();
  }
}

function closeDialog() {
  dialogIsOpen.value = false;
}

async function madeSearch(inputName: string, value: string) {
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
</script>

<template>
  <main class="guild">
    <GuildProfile
      :name="guild.name"
      :image="guild.image"
    />
    <Members
      :displayModes="displayModes"
      @sort="sort"
      @actionSelected="actionSelected"
      @sendValue="madeSearch"
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