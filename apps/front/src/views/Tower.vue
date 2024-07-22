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
const towerName = ref("");
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
  const result = await fetch(`${env.VITE_URL}/api/towers/${id}/show`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (result.ok) {
    tower.value = await result.json();
    towerDefenses.value = tower.value;

    if (tower.value.side === "yellow") {
      towerName.value = `Tour n°${tower.value.position} jaune`;
    } else if (tower.value.side === "red") {
      towerName.value = `Tour n°${tower.value.position} rouge`;
    } else {
      towerName.value = `Tour n°${tower.value.position} bleue`;
    }

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
    tower_id: id,
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
      tower_id: id,
    };
  } else {
    body.value = {
      filters: filters.value,
      tower_id: id,
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

  const previewMatchedWithTower = towerDefenses.value.defenses.filter(
    (defense) =>
      composition.defenses.find((compDefense) => compDefense.id === defense.id),
  );

  if (previewMatchedWithTower.length > 0) {
    previewToComposition.value.forEach((defense) => {
      if (
        previewMatchedWithTower.find(
          (previewDefense) => previewDefense.id === defense.id,
        )
      ) {
        defense.isSelected = true;
      }
    });
  }
}

function defenseHover(event) {
  if (
    event.querySelector(".defense__add") ||
    event.querySelector(".defense__remove")
  )
    return;

  if (event.querySelector(".defense__selected")) {
    const defenseRemove = document.createElement("div");

    defenseRemove.classList.add("defense__remove");
    defenseRemove.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 30 31" fill="none">\n' +
      '  <path d="M15 0.5C6.72 0.5 0 7.22 0 15.5C0 23.78 6.72 30.5 15 30.5C23.28 30.5 30 23.78 30 15.5C30 7.22 23.28 0.5 15 0.5ZM22.5 17H7.5V14H22.5V17Z" fill="#F85149"/>\n' +
      "</svg>";
    event.appendChild(defenseRemove);
    document.body.style.cursor = "pointer";
  } else {
    const defenseAdd = document.createElement("div");

    defenseAdd.classList.add("defense__add");
    defenseAdd.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 30 31" fill="none">\n' +
      '  <path fill-rule="evenodd" clip-rule="evenodd" d="M0 15.5C0 7.22 6.72 0.5 15 0.5C23.28 0.5 30 7.22 30 15.5C30 23.78 23.28 30.5 15 30.5C6.72 30.5 0 23.78 0 15.5ZM16.5 17H22.5V14H16.5V8H13.5V14H7.5V17H13.5V23H16.5V17Z" fill="#DE7800"/>\n' +
      "</svg>";
    event.appendChild(defenseAdd);
    document.body.style.cursor = "pointer";
  }
}

function defenseLeave(event) {
  if (event.querySelector(".defense__remove")) {
    event.querySelector(".defense__remove").remove();
  } else {
    event.querySelector(".defense__add").remove();
  }

  document.body.style.cursor = "default";
}

function addDefenseToTower(index, defense) {
  if (towerDefenses.value.defenses.length >= 5) {
    return;
  }

  if (towerDefenses.value.defenses.find((def) => def.id === index)) {
    removeDefenseFromTower(index);
    return;
  }

  towerDefenses.value.defenses.push({
    id: index,
    member: defense.member,
    leader: defense.leader,
    second: defense.second,
    third: defense.third,
  });

  previewToComposition.value.forEach((previewDefense) => {
    if (previewDefense.id === index) {
      previewDefense.isSelected = true;
    }
  });
}

function removeDefenseFromTower(index) {
  towerDefenses.value.defenses = towerDefenses.value.defenses.filter(
    (defense) => defense.id !== index,
  );

  previewToComposition.value.forEach((previewDefense) => {
    if (previewDefense.id === index) {
      previewDefense.isSelected = false;
    }
  });
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

  const result = await fetch(`${env.VITE_URL}/api/towers/${id}/show`, {
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
      :compositionName="towerName"
      :mode="'tower'"
      :grade="`${tower.grade} nat`"
      @saveComposition="saveTower"
      @clickOnDefense="removeDefenseFromTower"
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
