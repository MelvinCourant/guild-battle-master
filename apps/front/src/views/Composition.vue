<script setup>
import '../assets/css/views/_composition.scss';
import {provide, reactive, ref} from "vue";
import SearchComposition from "../components/SearchCompositions.vue";
import ActualComposition from "../components/utils/ActualComposition.vue";
import { useUserStore } from "../stores/user.js";

const env = import.meta.env;
const userStore = useUserStore();
const user = userStore.user;
const token = userStore.token;
const guildId = user.guild_id;
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
  }
]);
const filtersValues = ref({});
const comboboxLabels = ref(['Monstre leader', '2ème monstre', '3ème monstre']);
const comboboxOptions = ref([
  {
    value: 'light',
    text: 'Light',
    element: 'light',
    display: true
  },
  {
    value: 'dark',
    text: 'Dark',
    element: 'dark',
    display: true
  },
  {
    value: 'light-dark',
    text: 'Light/dark',
    element: 'dark-light',
    display: true
  }
])
const leaderMonsters = ref([]);
const secondMonsters = ref([]);
const thirdMonsters = ref([]);
const keyword = ref('');
const compositions = ref([]);

provide("fields", fields);
provide("filters", filters);
provide('filtersValues', filtersValues);
provide('compositions', compositions);

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
  let ids;

  if(name === 'search') {
    keyword.value = values;
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

  if(leaderMonsters.value.length > 0 && secondMonsters.value.length > 0 && thirdMonsters.value.length > 0) {
    const result = await fetch(`${env.VITE_URL}/api/boxes/${guildId}/search-compositions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        keyword: keyword.value,
        leader_monsters: leaderMonsters.value,
        second_monsters: secondMonsters.value,
        third_monsters: thirdMonsters.value
      })
    });

    if (result.ok) {
      compositions.value = await result.json();
    }
  }
}
</script>

<template>
  <main class="composition">
    <SearchComposition
      :comboboxLabels="comboboxLabels"
      :comboboxOptions="comboboxOptions"
      @updateValues="getCompositions"
      @search="getCompositions"
    />
    <ActualComposition/>
  </main>
</template>