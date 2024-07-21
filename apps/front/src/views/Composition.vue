<script setup>
import "../assets/css/views/_composition.scss";
import { provide, reactive, ref } from "vue";
import SearchComposition from "../components/SearchCompositions.vue";
import ActualComposition from "../components/ActualComposition.vue";
import Dialog from "../components/utils/Dialog.vue";
import { useUserStore } from "../stores/user.js";
import { useMonstersStore } from "../stores/monsters.js";
import { useRouter, useRoute } from "vue-router";

const env = import.meta.env;
const userStore = useUserStore();
const user = userStore.user;
const token = userStore.token;
const guildId = user.guild_id;
const monstersStore = useMonstersStore();
const router = useRouter();
const fields = reactive([
  {
    type: "search",
    name: "search",
    placeholder: "Membre",
  },
]);
const filters = reactive([
  {
    fields: [
      {
        label:
          "Afficher les monstres non-invocable par des vélins (fusions, Ifrits, etc.)",
        attributes: {
          type: "checkbox",
          name: "is_fusion_shop",
          checked: true,
        },
      },
    ],
  },
]);
const filtersValues = ref({});
const comboboxLabels = ["Monstre leader", "2ème monstre", "3ème monstre"];
const comboboxOptions = ref([
  {
    value: "light",
    text: "Light 5*",
    element: "light",
    display: true,
  },
  {
    value: "dark",
    text: "Dark 5*",
    element: "dark",
    display: true,
  },
  {
    value: "light-dark",
    text: "Light/dark 5*",
    element: "dark-light",
    display: true,
  },
]);
const comboboxValues = ref([
  {
    values: [],
  },
  {
    values: [],
  },
  {
    values: [],
  },
]);
const leaderMonsters = ref([]);
const secondMonsters = ref([]);
const thirdMonsters = ref([]);
const keyword = ref("");
const route = useRoute();
const compositionId = route.params.id;
const compositions = ref([]);
const compositionGrade = ref("5");
const compositionName = ref("");
const initialCompositions = ref([]);
const actualComposition = ref([]);
const defensesSelected = ref([]);
const defensesTemporarilyUnassigned = ref([]);

async function getActualComposition() {
  const result = await fetch(
    `${env.VITE_URL}/api/compositions/${compositionId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (result.ok) {
    const resultJson = await result.json();
    compositionName.value = resultJson.name;
    compositionGrade.value = resultJson.grade;

    if (!router.currentRoute.value.query.d) {
      actualComposition.value = resultJson.defenses;
    }

    initialCompositions.value = JSON.parse(JSON.stringify(resultJson.defenses));
  } else {
    await router.push("/composition");
  }
}

async function getQueryParams() {
  const query = router.currentRoute.value.query;

  function addLightDarkCombobox(element, comboboxId) {
    const elementDetails = comboboxOptions.value.find(
      (option) => option.value === element,
    );

    comboboxValues.value[comboboxId].values.push({
      value: element,
      text: elementDetails.text,
      element: elementDetails.element,
    });
  }

  if (query.l) {
    leaderMonsters.value = JSON.parse(query.l);
    for (const id of leaderMonsters.value) {
      if (id === "light-dark" || id === "light" || id === "dark") {
        addLightDarkCombobox(id, 0);
        continue;
      }

      await getMonster(id).then((monster) => {
        comboboxValues.value[0].values.push({
          value: monster.unitMasterId,
          text: monster.name,
          element: monster.element,
        });
      });
    }
  }

  if (query.s) {
    secondMonsters.value = JSON.parse(query.s);

    for (const id of secondMonsters.value) {
      if (id === "light-dark" || id === "light" || id === "dark") {
        addLightDarkCombobox(id, 1);
        continue;
      }

      await getMonster(id).then((monster) => {
        comboboxValues.value[1].values.push({
          value: monster.unitMasterId,
          text: monster.name,
          element: monster.element,
        });
      });
    }
  }

  if (query.t) {
    thirdMonsters.value = JSON.parse(query.t);

    for (const id of thirdMonsters.value) {
      if (id === "light-dark" || id === "light" || id === "dark") {
        addLightDarkCombobox(id, 2);
        continue;
      }

      await getMonster(id).then((monster) => {
        comboboxValues.value[2].values.push({
          value: monster.unitMasterId,
          text: monster.name,
          element: monster.element,
        });
      });
    }
  }

  if (query.k) {
    keyword.value = query.k;
    fields[0].value = query.k;
  }

  if (query.f) {
    filtersValues.value = JSON.parse(query.f);
    filters.forEach((filter) => {
      filter.fields.forEach((field) => {
        for (const key in filtersValues.value) {
          if (field.attributes.name === key) {
            field.attributes.checked = JSON.parse(query.f)[key];

            if (JSON.parse(query.f)[key] === true) {
              delete filtersValues.value[key];
            }
          }
        }
      });
    });
  }

  if (query.d) {
    defensesSelected.value = JSON.parse(query.d);

    for (const defenseSelected of defensesSelected.value) {
      let defense;

      for (const key in defenseSelected) {
        if (key === "leader" || key === "second" || key === "third") {
          await getMonster(defenseSelected[key]).then((monster) => {
            defense = {
              ...defense,
              [key]: {
                unit_master_id: monster.unitMasterId,
                image: monster.image,
              },
            };
          });
        } else {
          await getMember(defenseSelected[key]).then((memberDetails) => {
            defense = {
              ...defense,
              member: {
                id: defenseSelected[key],
                pseudo: memberDetails.member.pseudo,
              },
            };
          });
        }
      }

      actualComposition.value.push(defense);
    }
  }

  if (query.n) {
    compositionName.value = query.n;
  }

  if (query.g) {
    compositionGrade.value = query.g;
  }

  if (query.dtu) {
    defensesTemporarilyUnassigned.value = JSON.parse(query.dtu);
  }
}

async function initWithParams() {
  await getQueryParams();
  await getCompositions();
}

if (compositionId) {
  getActualComposition();
}

if (router.currentRoute.value.query) {
  initWithParams();
}

async function addOrRemoveQueryParams(name) {
  let query = {};

  if (router.currentRoute.value.query) {
    query = { ...router.currentRoute.value.query };
  }

  if (name === "Monstre leader") {
    query.l = JSON.stringify(leaderMonsters.value);
  } else if (name === "2ème monstre") {
    query.s = JSON.stringify(secondMonsters.value);
  } else if (name === "3ème monstre") {
    query.t = JSON.stringify(thirdMonsters.value);
  } else if (name === "search") {
    query.k = keyword.value;
  } else if (name === "filters") {
    query.f = JSON.stringify(filtersValues.value);
  } else if (name === "defense-selected") {
    query.d = JSON.stringify(defensesSelected.value);
  } else if (name === "name") {
    query.n = compositionName.value;
  } else if (name === "grade") {
    query.g = compositionGrade.value;
  } else if (name === "defenses-temporarily-unassigned") {
    query.dtu = JSON.stringify(defensesTemporarilyUnassigned.value);
  }

  for (const key in query) {
    if (query[key] === "[]" || query[key] === "{}" || query[key] === "") {
      delete query[key];
    }
  }

  await router.push({ path: router.currentRoute.path, query: query });
}

const dialog = {
  content: {
    title: "Est-vous sûr de vouloir annuler ?",
    description: "Les modifications non sauvegardées seront perdues.",
  },
  fields: [
    {
      type: "button",
      name: "back",
      value: "Revenir",
    },
    {
      type: "button",
      name: "cancel",
      value: "Annuler",
      style: "danger",
    },
  ],
};
const dialogIsOpen = ref(false);

provide("fields", fields);
provide("filters", filters);
provide("filtersValues", filtersValues);

async function getAllMonsters() {
  const result = await fetch(`${env.VITE_URL}/api/monsters`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      grade: "all",
    }),
  });

  if (result.ok) {
    const data = await result.json();

    comboboxOptions.value = [
      {
        value: "light",
        text: "Light 5*",
        element: "light",
        display: true,
      },
      {
        value: "dark",
        text: "Dark 5*",
        element: "dark",
        display: true,
      },
      {
        value: "light-dark",
        text: "Light/dark 5*",
        element: "dark-light",
        display: true,
      },
    ];
    data.forEach((monster) => {
      comboboxOptions.value.push({
        value: monster.unitMasterId,
        text: monster.name,
        element: monster.element,
        display: true,
      });
    });
  }
}

getAllMonsters();

async function getLessFiveStarsMonsters() {
  const result = await fetch(`${env.VITE_URL}/api/monsters`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      grade: 4,
    }),
  });

  if (result.ok) {
    const data = await result.json();

    comboboxOptions.value = [];
    data.forEach((monster) => {
      comboboxOptions.value.push({
        value: monster.unitMasterId,
        text: monster.name,
        element: monster.element,
        display: true,
      });
    });
  }
}

async function getMember(id) {
  const result = await fetch(`${env.VITE_URL}/api/members/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (result.ok) {
    return await result.json();
  }
}

async function getMonster(id) {
  const monster = monstersStore.getMonster(id);
  let monsterDetails;

  if (monster) {
    monsterDetails = monster;
  } else {
    const result = await fetch(`${env.VITE_URL}/api/monsters/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.ok) {
      monsterDetails = await result.json();
      monstersStore.setMonster(monsterDetails);
    }
  }

  return monsterDetails;
}

async function getCompositions(name, values) {
  let body;
  let ids;

  if (name === "search") {
    keyword.value = values;
  } else if (name === "filters") {
    filtersValues.value = values;
    filters.forEach((filter) => {
      filter.fields.forEach((field) => {
        for (const key in filtersValues.value) {
          if (field.attributes.name === key) {
            field.attributes.checked = values[key];

            if (values[key] === true) {
              delete filtersValues.value[key];
            }
          }
        }
      });
    });
  } else if (name === "defense-selected") {
    defensesSelected.value = [];

    actualComposition.value.forEach((composition) => {
      defensesSelected.value.push({
        member: composition.member.id,
        leader: composition.leader.unit_master_id,
        second: composition.second.unit_master_id,
        third: composition.third.unit_master_id,
      });
    });
  } else if (comboboxLabels.includes(name)) {
    ids = values.map((value) => value.value);
  }

  if (name === "Monstre leader") {
    leaderMonsters.value = ids;
  } else if (name === "2ème monstre") {
    secondMonsters.value = ids;
  } else if (name === "3ème monstre") {
    thirdMonsters.value = ids;
  }

  await addOrRemoveQueryParams(name);

  if (defensesSelected.value.length > 0) {
    const defensesSelectedBody = defensesSelected.value.filter(
      (defense) =>
        !initialCompositions.value.some(
          (initialDefense) =>
            initialDefense.member === defense.member &&
            initialDefense.leader === defense.leader &&
            initialDefense.second === defense.second &&
            initialDefense.third === defense.third,
        ),
    );

    body = {
      defenses_selected: defensesSelectedBody,
    };
  }

  if (keyword.value.length > 0) {
    body = {
      ...body,
      keyword: keyword.value,
    };
  }

  if (Object.keys(filtersValues.value).length > 0) {
    body = {
      ...body,
      filters: filtersValues.value,
    };
  }

  if (defensesTemporarilyUnassigned.value.length > 0) {
    body = {
      ...body,
      defenses_temporarily_unassigned: defensesTemporarilyUnassigned.value,
    };
  }

  body = {
    ...body,
    grade: compositionGrade.value,
    leader_monsters: leaderMonsters.value,
    second_monsters: secondMonsters.value,
    third_monsters: thirdMonsters.value,
  };

  if (
    leaderMonsters.value.length > 0 &&
    secondMonsters.value.length > 0 &&
    thirdMonsters.value.length > 0
  ) {
    const result = await fetch(
      `${env.VITE_URL}/api/boxes/${guildId}/search-compositions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      },
    );

    if (result.ok) {
      compositions.value = await result.json();
    }
  }
}

async function addDefense(index, defense) {
  actualComposition.value.push(defense);

  if (
    initialCompositions.value.find(
      (initialDefense) =>
        initialDefense.member.id === defense.member.id &&
        initialDefense.leader.unit_master_id ===
          defense.leader.unit_master_id &&
        initialDefense.second.unit_master_id ===
          defense.second.unit_master_id &&
        initialDefense.third.unit_master_id === defense.third.unit_master_id,
    )
  ) {
    let defenseFind = false;

    defensesTemporarilyUnassigned.value.forEach(
      (defenseTemporarilyUnassigned) => {
        if (
          !defenseFind &&
          defenseTemporarilyUnassigned.member === defense.member.id &&
          defenseTemporarilyUnassigned.leader ===
            defense.leader.unit_master_id &&
          defenseTemporarilyUnassigned.second ===
            defense.second.unit_master_id &&
          defenseTemporarilyUnassigned.third === defense.third.unit_master_id
        ) {
          defensesTemporarilyUnassigned.value.splice(
            defensesTemporarilyUnassigned.value.indexOf(
              defenseTemporarilyUnassigned,
            ),
            1,
          );
          defenseFind = true;
        }
      },
    );

    await addOrRemoveQueryParams("defenses-temporarily-unassigned");
  }

  await getCompositions("defense-selected");
}

async function removeDefense(index, defense) {
  actualComposition.value.splice(index, 1);

  if (
    initialCompositions.value.find(
      (initialDefense) =>
        initialDefense.member.id === defense.member.id &&
        initialDefense.leader.unit_master_id ===
          defense.leader.unit_master_id &&
        initialDefense.second.unit_master_id ===
          defense.second.unit_master_id &&
        initialDefense.third.unit_master_id === defense.third.unit_master_id,
    )
  ) {
    defensesTemporarilyUnassigned.value.push({
      member: defense.member.id,
      leader: defense.leader.unit_master_id,
      second: defense.second.unit_master_id,
      third: defense.third.unit_master_id,
    });

    await addOrRemoveQueryParams("defenses-temporarily-unassigned");
  }

  await getCompositions("defense-selected");
}

async function updateCompositionGrade(value) {
  compositionGrade.value = value;

  actualComposition.value = [];
  defensesSelected.value = [];
  await router.push({ path: router.currentRoute.path, query: {} });

  if (value === "4") {
    await getLessFiveStarsMonsters();
    await addOrRemoveQueryParams("grade");
  } else {
    await getAllMonsters();
  }

  await getCompositions();
}

function updateCompositionName(name, value) {
  compositionName.value = value;
  addOrRemoveQueryParams("name");
}

async function saveComposition() {
  if (!compositionName.value) {
    return;
  }

  const body = {
    name: compositionName.value,
    grade: parseInt(compositionGrade.value),
    defenses: defensesSelected.value,
  };

  let result;

  if (compositionId) {
    result = await fetch(`${env.VITE_URL}/api/compositions/${compositionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  } else {
    result = await fetch(`${env.VITE_URL}/api/compositions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  }

  if (result.ok) {
    await router.push("/defenses");
  }
}

function dialogResponse(name) {
  if (name === "back") {
    dialogIsOpen.value = false;
  } else {
    router.push("/defenses");
  }
}
</script>

<template>
  <main class="composition">
    <h1 class="hidden-title">Ajouter une composition</h1>
    <SearchComposition
      :compositions="compositions"
      :comboboxLabels="comboboxLabels"
      :comboboxOptions="comboboxOptions"
      :comboboxValues="comboboxValues"
      @updateValues="getCompositions"
      @search="getCompositions"
      @clickOnDefense="addDefense"
    />
    <ActualComposition
      :compositions="actualComposition"
      :compositionName="compositionName"
      :optionValue="compositionGrade"
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
