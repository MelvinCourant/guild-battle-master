<script setup>
import '../assets/css/views/_composition.scss';
import {provide, reactive, ref} from "vue";
import SearchComposition from "../components/SearchCompositions.vue";
import ActualComposition from "../components/utils/ActualComposition.vue";
import { useUserStore } from "../stores/user.js";

const env = import.meta.env;
const userStore = useUserStore();
const guildId = userStore.guild_id;
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
  {
    title: "Grade naturel",
    fields: [
      {
        label: "2 étoiles",
        attributes: {
          type: "checkbox",
          name: "2_stars",
          checked: true
        }
      },
      {
        label: "3 étoiles",
        attributes: {
          type: "checkbox",
          name: "3_stars",
          checked: true
        }
      },
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

async function getCompositions(label, values) {
  if (label === 'Monstre leader') {
    leaderMonsters.value = values;
  } else if (label === '2ème monstre') {
    secondMonsters.value = values;
  } else if (label === '3ème monstre') {
    thirdMonsters.value = values;
  }

  if(leaderMonsters.value.length > 0 && secondMonsters.value.length > 0 && thirdMonsters.value.length > 0) {
    const result = await fetch(`${env.VITE_URL}/api/boxes/${guildId}/search-compositions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        leader_monsters: leaderMonsters.value,
        second_monsters: secondMonsters.value,
        third_monsters: thirdMonsters.value
      })
    });

    if (result.ok) {
      const data = await result.json();
      console.log(data);
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
    />
    <ActualComposition/>
  </main>
</template>