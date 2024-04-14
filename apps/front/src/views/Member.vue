<script setup>
import '../assets/css/views/_member.scss';
import MemberProfile from "../components/MemberProfile.vue";
import Monsters from "../components/Monsters.vue";
import {provide, ref, reactive, watch} from "vue";
import {useRoute} from "vue-router";
import { useUserStore } from "../stores/user.js";

const env = import.meta.env;
const userStore = useUserStore();
const token = userStore.token;
const user = userStore.user;
const memberId = ref(user.member_id);
const route = useRoute();
const params = route.params;
const id = parseInt(params.id);
const member = ref({});
const monsters = ref([]);
const fields = [
  {
    type: "search",
    name: "search",
    placeholder: "Nom du monstre",
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
    title: "Élements",
    fields: [
      {
        label: "Feu",
        attributes: {
          type: "checkbox",
          name: "fire",
          checked: true
        }
      },
      {
        label: "Eau",
        attributes: {
          type: "checkbox",
          name: "water",
          checked: true
        }
      },
      {
        label: "Vent",
        attributes: {
          type: "checkbox",
          name: "wind",
          checked: true
        }
      },
      {
        label: "Lumière",
        attributes: {
          type: "checkbox",
          name: "light",
          checked: true
        }
      },
      {
        label: "Ténèbres",
        attributes: {
          type: "checkbox",
          name: "dark",
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
const loading = ref(true);
const keyword = ref('');
const sortOptions = [
  {
    value: 'element',
    text: 'Élément'
  },
  {
    value: 'quantity',
    text: 'Quantité'
  },
  {
    value: 'grade',
    text: 'Grade naturel'
  },
  {
    value: 'name',
    text: 'Nom'
  }
];
const actualSort = ref('element');

provide('monsters', monsters);
provide('fields', fields);
provide('filters', filters);
provide('filtersValues', filtersValues);
provide('loading', loading);
provide('sortOptions', sortOptions);
provide('sortValue', actualSort);

function initPage() {
  if(
      id &&
      memberId.value !== id
  ) {
    memberId.value = id;
  } else if(
      id &&
      memberId.value === id
  ) {
    memberId.value = user.member_id;
  }

  getMember();
}

initPage();

watch(() => route.path, () => {
  initPage();
});

async function getMember() {
  const result = await fetch(`${env.VITE_URL}/api/members/${memberId.value}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  if (result.ok) {
    const resultJson = await result.json();

    member.value = resultJson.member;
    monsters.value = resultJson.monsters;
    loading.value = false;
  }
}

async function searchMonsters(inputName, value) {
  if(inputName === 'search') {
    keyword.value = value;
  } else if(inputName === 'sortGrid') {
    actualSort.value = value;
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

  body = {
    ...body,
    sort: actualSort.value
  };

  const result = await fetch(`${env.VITE_URL}/api/boxes/${memberId.value}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  if (result.ok) {
    monsters.value = await result.json();
  }
}
</script>

<template>
  <main class="member">
    <MemberProfile
        :memberId="memberId"
        :pseudo="member.pseudo"
        :grade="member.grade"
        :image="member.image"
    />
    <Monsters
        @search="searchMonsters"
        @sortGrid="searchMonsters('sortGrid', $event)"
    />
  </main>
</template>