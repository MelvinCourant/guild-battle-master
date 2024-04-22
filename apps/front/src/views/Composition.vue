<script setup>
import '../assets/css/views/_composition.scss';
import {provide, reactive, ref} from "vue";
import SearchComposition from "../components/SearchCompositions.vue";
import ActualComposition from "../components/ActualComposition.vue";
import Dialog from "../components/utils/Dialog.vue";
import { useUserStore } from "../stores/user.js";
import { useRouter } from "vue-router";

const env = import.meta.env;
const userStore = useUserStore();
const user = userStore.user;
const token = userStore.token;
const guildId = user.guild_id;
const router = useRouter();
const fields = [
  {
    type: "search",
    name: "search",
    placeholder: "Membre",
  }
];
const filters = reactive([
  {
    fields: [
      {
        label: "Afficher les monstres non-invocable par des vélins (fusions, Ifrits, etc.)",
        attributes: {
          type: "checkbox",
          name: "is_fusion_shop",
          checked: true
        }
      }
    ]
  },
]);
const filtersValues = ref({});
const comboboxLabels = ref(['Monstre leader', '2ème monstre', '3ème monstre']);
const comboboxOptions = ref([
  {
    value: 'light',
    text: 'Light 5*',
    element: 'light',
    display: true
  },
  {
    value: 'dark',
    text: 'Dark 5*',
    element: 'dark',
    display: true
  },
  {
    value: 'light-dark',
    text: 'Light/dark 5*',
    element: 'dark-light',
    display: true
  }
])
const leaderMonsters = ref([]);
const secondMonsters = ref([]);
const thirdMonsters = ref([]);
const keyword = ref('');
const compositions = ref([]);
const compositionGrade = ref('5');
const compositionName = ref('');
const actualComposition = ref([]);
const dialog = ref({
  content: {
    title: 'Est-vous sûr de vouloir annuler ?',
    description: 'Les modifications non sauvegardées seront perdues.',
  },
  fields: [
    {
      type: 'button',
      name: 'back',
      value: 'Revenir',
    },
    {
      type: 'button',
      name: 'cancel',
      value: 'Annuler',
      style: 'danger'
    }
  ]
});
const dialogIsOpen = ref(false);

provide("fields", fields);
provide("filters", filters);
provide('filtersValues', filtersValues);

async function getAllMonsters() {
  const result = await fetch(`${env.VITE_URL}/api/monsters`);

  if (result.ok) {
    const data = await result.json();

    data.forEach((monster) => {
      comboboxOptions.value.push({
        value: monster.unitMasterId,
        text: monster.name,
        element: monster.element,
        display: true
      });
    });
  }
}

getAllMonsters();

async function getCompositions(name, values) {
  let body;
  let ids;

  if(name === 'search') {
    keyword.value = values;
  } else if(name === 'filters') {
    filtersValues.value = values;
    filters.forEach(filter => {
      filter.fields.forEach(field => {
        for(const key in filtersValues.value) {
          if(field.attributes.name === key) {
            field.attributes.checked = values[key];

            if(values[key] === true) {
              delete filtersValues.value[key];
            }
          }
        }
      });
    });
  } else {
    ids = values.map((value) => value.value);
  }

  if (name === 'Monstre leader') {
    leaderMonsters.value = ids;
  } else if (name === '2ème monstre') {
    secondMonsters.value = ids;
  } else if (name === '3ème monstre') {
    thirdMonsters.value = ids;
  }

  if(keyword.value.length > 0) {
    body = {
      keyword: keyword.value,
      ...filtersValues.value
    };
  }

  if(Object.keys(filtersValues.value).length > 0){
    body = {
      filters: filtersValues.value
    };
  }

  body = {
    ...body,
    leader_monsters: leaderMonsters.value,
    second_monsters: secondMonsters.value,
    third_monsters: thirdMonsters.value
  };

  if(leaderMonsters.value.length > 0 && secondMonsters.value.length > 0 && thirdMonsters.value.length > 0) {
    const result = await fetch(`${env.VITE_URL}/api/boxes/${guildId}/search-compositions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (result.ok) {
      compositions.value = await result.json();
    }
  }
}

function addDefense(index, defense) {
  actualComposition.value.push(defense);
  compositions.value.splice(index, 1);
}

function removeDefense(index, defense) {
  compositions.value.push(defense);
  actualComposition.value.splice(index, 1);
}

function updateCompositionGrade(value) {
  compositionGrade.value = value;
}

function updateCompositionName(name, value) {
  compositionName.value = value;
}

async function saveComposition() {
  if(!compositionName.value) {
    return;
  }

  let defenses = [];

  actualComposition.value.forEach((composition) => {
    defenses.push({
      member: composition.member.id,
      leader: composition.leader.unit_master_id,
      second: composition.second.unit_master_id,
      third: composition.third.unit_master_id
    });
  });

  const body = {
    name: compositionName.value,
    grade: parseInt(compositionGrade.value),
    defenses: defenses
  };

  const result = await fetch(`${env.VITE_URL}/api/compositions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  if (result.ok) {
    await router.push('/defenses');
  }
}

function dialogResponse(name) {
  if(name === 'back') {
    dialogIsOpen.value = false;
  } else {
    router.push('/defenses');
  }
}
</script>

<template>
  <main class="composition">
    <SearchComposition
      :compositions="compositions"
      :comboboxLabels="comboboxLabels"
      :comboboxOptions="comboboxOptions"
      @updateValues="getCompositions"
      @search="getCompositions"
      @clickOnDefense="addDefense"
    />
    <ActualComposition
      :compositions="actualComposition"
      @clickOnDefense="removeDefense"
      @updateCompositionGrade="updateCompositionGrade"
      @updateCompositionName="updateCompositionName"
      @saveComposition="saveComposition"
      @cancel="dialogIsOpen = true"
    />
  </main>
  <Dialog
    :dialog="dialog"
    :isOpen="dialogIsOpen"
    @click="dialogResponse"
    @close="dialogIsOpen = false"
  />
</template>