<script setup>
import '../assets/css/views/_defenses.scss';
import GuildCompositions from "../components/GuildCompositions.vue";
import {useUserStore} from "../stores/user.js";
import {provide, ref, reactive} from 'vue';
import {useRouter} from 'vue-router';
import Dialog from "../components/utils/Dialog.vue";

const env = import.meta.env;
const userStore = useUserStore();
const user = userStore.user;
const guildId = user.guild_id;
const token = userStore.token;
const fields = [
  {
    type: "search",
    name: "search",
    placeholder: "Nom d'une composition",
  }
];
const filters = reactive([
  {
    title: "Type de tour",
    fields: [
      {
        label: "4 étoiles",
        attributes: {
          type: "checkbox",
          name: "4_stars",
          checked: true
        }
      },
      {
        label: "5 étoiles",
        attributes: {
          type: "checkbox",
          name: "5_stars",
          checked: true
        }
      }
    ]
  }
]);
const filtersValues = ref({});
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
const memberRole = user.role;
const router = useRouter();
const dialog = reactive({
  content: {
    title: '',
    description: 'Les défenses de cette composition seront supprimées et les monstres assignés seront de nouveau disponibles.',
  },
  fields: [
    {
      type: 'button',
      name: 'back',
      value: 'Revenir',
    },
    {
      type: 'button',
      name: 'delete',
      value: 'Supprimer',
      style: 'danger'
    }
  ]
});
const dialogIsOpen = ref(false);
const compositionSelected = ref(null)

provide("fields", fields);
provide('filters', filters);
provide('filtersValues', filtersValues);

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

async function deleteComposition(id) {
  const result = await fetch(`${env.VITE_URL}/api/compositions/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

  if (result.ok) {
    await getAllCompositions();
  }
}

function actionSelected({action, id}) {
  if(action === 'update') {
    router.push(`/composition/${id}`);
  } else {
    const compositionSelectedName = compositions.value.find((composition) => composition.id === id).name;

    dialog.content.title = `Supprimer la composition ${compositionSelectedName} ?`;
    dialogIsOpen.value = true;
    compositionSelected.value = id;
  }
}

function dialogResponse(name) {
  if(name === 'back') {
    dialogIsOpen.value = false;
  } else {
    deleteComposition(compositionSelected.value);
    dialogIsOpen.value = false;
  }
}

async function searchComposition(inputName, value) {
  if(inputName === 'search') {
    keyword.value = value;
  } else {
    filtersValues.value = value;
    filters.forEach(filter => {
      filter.fields.forEach(field => {
        for(const key in filtersValues.value) {
          if(field.attributes.name === key) {
            field.attributes.checked = value[key];

            if(value[key] === true) {
              delete filtersValues.value[key];
            }
          }
        }
      });
    });
  }

  let body;

  if(keyword.value) {
    body = {
      keyword: keyword.value
    };
  }

  if(Object.keys(filtersValues.value).length > 0){
    body = {
      ...body,
      filters: filtersValues.value
    };
  }

  const result = await fetch(`${env.VITE_URL}/api/compositions/${guildId}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  if (result.ok) {
    compositions.value = await result.json();
  }
}
</script>

<template>
  <main class="defenses">
    <GuildCompositions
      :compositions="compositions"
      :actions="actions"
      :memberRole="memberRole"
      @search="searchComposition"
      @actionSelected="actionSelected"
      :loading="loading"
    />
    <router-link
        to="/composition"
        title="Ajouter une composition"
        class="defenses__add-composition"
        v-if="memberRole !== 'member'"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.8235 10.2605H10.2605V17.8235H7.73948V10.2605H0.176453V7.7395H7.73948V0.176472H10.2605V7.7395H17.8235V10.2605Z" fill="var(--white)"/>
      </svg>
    </router-link>
  </main>
  <Dialog
    :dialog="dialog"
    :isOpen="dialogIsOpen"
    @click="dialogResponse"
    @close="dialogIsOpen = false"
  />
</template>