<script setup>
import "../assets/css/views/_tower.scss";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../stores/user.js";
import { provide, ref } from "vue";
import GuildCompositions from "../components/GuildCompositions.vue";
import Preview from "../components/utils/Preview.vue";
import ActualComposition from "../components/ActualComposition.vue";

const route = useRoute();
const router = useRouter();
const params = route.params;
const id = params.id;
const env = import.meta.env;
const userStore = useUserStore();
const token = userStore.token;
const user = userStore.user;
const guildId = user.guild_id;
const tower = ref({});
const compositions = ref([]);
const fields = [
  {
    type: "search",
    name: "search",
    placeholder: "Nom d'une composition",
  },
];
const body = ref({});
const filters = ref({});
const keyword = ref("");
const previewCategory = ref("");
const previewTitle = ref("");
const previewIsOpen = ref(false);
const previewToComposition = ref([]);
const compositionId = ref(null);
const towerDefenses = ref([]);

provide("fields", fields);
provide("compositions", previewToComposition);

async function getTower() {
  const result = await fetch(`${env.VITE_URL}/api/towers/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (result.ok) {
    tower.value = await result.json();
    towerDefenses.value = tower.value;
    await getCompositions();
  }
}

getTower();

async function getCompositions() {
  if (tower.value.grade === "5") {
    filters.value = {
      "4_stars": false,
    };
  } else {
    filters.value = {
      "5_stars": false,
    };
  }

  body.value = {
    filters: filters.value,
  };

  const result = await fetch(
    `${env.VITE_URL}/api/compositions/${guildId}/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body.value),
    },
  );

  if (result.ok) {
    compositions.value = await result.json();
  }
}

async function searchComposition(inputName, value) {
  if (inputName === "search") {
    keyword.value = value;
  }

  if (keyword.value) {
    body.value = {
      keyword: keyword.value,
      filters: filters.value,
    };
  } else {
    body.value = {
      filters: filters.value,
    };
  }

  const result = await fetch(
    `${env.VITE_URL}/api/compositions/${guildId}/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body.value),
    },
  );

  if (result.ok) {
    compositions.value = await result.json();
  }
}

function previewComposition(id) {
  const composition = compositions.value.find(
    (composition) => composition.id === id,
  );

  previewCategory.value = `Tour ${composition.grade} nat`;
  previewTitle.value = composition.name;
  previewIsOpen.value = true;
  previewToComposition.value = composition.defenses;
  compositionId.value = id;
}

function defenseHover(event) {
  const defenseRemove = document.createElement("div");

  defenseRemove.classList.add("defense__remove");
  defenseRemove.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 30 31" fill="none">\n' +
    '  <path d="M15 0.5C6.72 0.5 0 7.22 0 15.5C0 23.78 6.72 30.5 15 30.5C23.28 30.5 30 23.78 30 15.5C30 7.22 23.28 0.5 15 0.5ZM22.5 17H7.5V14H22.5V17Z" fill="#F85149"/>\n' +
    "</svg>";
  event.appendChild(defenseRemove);
  document.body.style.cursor = "pointer";
}

function defenseLeave(event) {
  if (event.querySelector(".defense__remove")) {
    event.querySelector(".defense__remove").remove();
    document.body.style.cursor = "default";
  }
}

function addDefenseToTower(index, defense) {
  towerDefenses.value.defenses.push({
    id: index,
    member: defense.member,
    leader: defense.leader,
    second: defense.second,
    third: defense.third,
  });
  const composition = compositions.value.find(
    (composition) => composition.id === compositionId.value,
  );
  composition.defenses = composition.defenses.filter(
    (compDefense) => compDefense.id !== index,
  );

  previewToComposition.value = composition.defenses;

  if (composition.defenses.length === 0) {
    compositions.value = compositions.value.filter(
      (comp) => comp.id !== compositionId.value,
    );
  }
}

async function saveTower() {
  let body = {};
  let defenses = [];

  towerDefenses.value.defenses.forEach((defense) => {
    defenses.push(defense.id);
  });

  body = {
    defenses: defenses,
  };

  const result = await fetch(`${env.VITE_URL}/api/towers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (result.ok) {
    await router.push("/map");
  }
}
</script>

<template>
  <main class="tower">
    <GuildCompositions
      :compositions="compositions"
      @search="searchComposition"
      @previewComposition="previewComposition"
    />
    <ActualComposition
      :compositions="towerDefenses.defenses"
      :compositionName="`Tour n°${tower.position}`"
      :mode="'tower'"
      :grade="`${tower.grade} nat`"
      @saveComposition="saveTower"
    />
    <Preview
      :category="previewCategory"
      :title="previewTitle"
      :isOpen="previewIsOpen"
      :compositionId="compositionId"
      orientation="left"
      @hidePreview="previewIsOpen = false"
      @defenseHover="defenseHover"
      @defenseLeave="defenseLeave"
      @clickOnDefense="addDefenseToTower"
    />
  </main>
</template>
