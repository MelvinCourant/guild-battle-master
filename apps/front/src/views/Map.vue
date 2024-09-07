<script setup>
import "../assets/css/views/_map.scss";
import Tabs from "../components/menus/Tabs.vue";
import { provide, reactive, ref } from "vue";
import MapGrid from "../components/grids/MapGrid.vue";
import { useUserStore } from "../stores/user.js";
import Dialog from "../components/utils/Dialog.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const env = import.meta.env;
const userStore = useUserStore();
const token = userStore.token;
const links = [
  {
    id: 1,
    name: t("siege_map"),
    path: "/map",
    selected: true,
  },
  {
    id: 2,
    name: t("defenses_per_member"),
    path: "/defenses-per-member",
    selected: false,
  },
];
const tools = [
  {
    name: "filters",
    title: t("tower_type"),
  },
  {
    name: "reset",
    title: t("reset_map"),
  },
];
const filters = reactive([
  {
    title: t("tower_type"),
    fields: [
      {
        label: t("nb_stars", { number: 4 }),
        attributes: {
          type: "checkbox",
          name: "4_stars",
          checked: true,
        },
      },
      {
        label: t("nb_stars", { number: 5 }),
        attributes: {
          type: "checkbox",
          name: "5_stars",
          checked: true,
        },
      },
    ],
  },
]);
const filtersValues = ref({});
const cards = ref([]);
const dialog = {
  content: {
    title: t("reset_map"),
    description: t("reset_dialog_description"),
  },
  fields: [
    {
      type: "button",
      name: "cancel",
      value: t("cancel"),
    },
    {
      type: "button",
      name: "confirm",
      value: t("confirm"),
      style: "danger",
    },
  ],
};
const dialogIsOpen = ref(false);

provide("filters", filters);
provide("filtersValues", filtersValues);

async function getTowers() {
  let gradeParam = "";
  let valuesInTrue = [];

  filters.forEach((filter) => {
    filter.fields.forEach((field) => {
      if (field.attributes.checked === true) {
        valuesInTrue.push(field.attributes.name);
      }
    });
  });

  if (valuesInTrue.length > 0 && valuesInTrue.length < 2) {
    const formattedValue = parseInt(valuesInTrue[0].split("_")[0]);
    gradeParam = `?grade=${formattedValue}`;
  }

  const result = await fetch(`${env.VITE_URL}/api/towers/list${gradeParam}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Accept-Language": userStore.language,
    },
  });

  if (result.ok) {
    cards.value = await result.json();
  }
}

getTowers();

async function resetTowers() {
  const result = await fetch(`${env.VITE_URL}/api/towers/reset`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Accept-Language": userStore.language,
    },
  });

  if (result.ok) {
    cards.value.forEach((card) => {
      card.defenses = [];
    });
  }
}

function toolClicked(tool) {
  if (tool.name === "reset") {
    dialogIsOpen.value = true;
  }
}

function filterTowers(inputName, value) {
  filtersValues.value = value;
  filters.forEach((filter) => {
    filter.fields.forEach((field) => {
      for (const key in filtersValues.value) {
        if (field.attributes.name === key) {
          field.attributes.checked = value[key];

          if (value[key] === true) {
            delete filtersValues.value[key];
          }
        }
      }
    });
  });

  getTowers();
}

function confirmOrCancelReset(action) {
  if (action === "confirm") {
    resetTowers();
  }

  dialogIsOpen.value = false;
}
</script>

<template>
  <main class="map">
    <h1 class="hidden-title">{{ t("siege_map") }}</h1>
    <Tabs
      :links="links"
      :tools="tools"
      @toolClicked="toolClicked"
      @search="filterTowers"
    />
    <MapGrid :cards="cards" />
    <Dialog
      :dialog="dialog"
      :isOpen="dialogIsOpen"
      @close="dialogIsOpen = false"
      @click="confirmOrCancelReset"
    />
  </main>
</template>
