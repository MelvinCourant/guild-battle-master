<script setup>
import '../assets/css/views/_composition.scss';
import {provide, reactive, ref} from "vue";
import SearchComposition from "../components/SearchCompositions.vue";
import ActualComposition from "../components/utils/ActualComposition.vue";

const env = import.meta.env;
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
    text: 'Light'
  },
  {
    value: 'dark',
    text: 'Dark'
  },
  {
    value: 'light-dark',
    text: 'Light/dark'
  }
])

provide("fields", fields);
provide("filters", filters);
provide('filtersValues', filtersValues);

async function getAllMonsters() {
  const result = await fetch(`${env.VITE_URL}/api/monsters`);

  if (result.ok) {
    let data = await result.json();
    data = data.sort((a, b) => a.name.localeCompare(b.name));

    data.forEach((monster) => {
      comboboxOptions.value.push({
        value: monster.unitMasterId,
        text: monster.name
      });
    });
  }
}

getAllMonsters();
</script>

<template>
  <main class="composition">
    <SearchComposition
      :comboboxLabels="comboboxLabels"
      :comboboxOptions="comboboxOptions"
    />
    <ActualComposition/>
  </main>
</template>