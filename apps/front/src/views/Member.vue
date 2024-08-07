<script setup>
import "../assets/css/views/_member.scss";
import MemberProfile from "../components/MemberProfile.vue";
import Monsters from "../components/Monsters.vue";
import { provide, ref, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../stores/user.js";
import Alert from "../components/utils/Alert.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const env = import.meta.env;
const userStore = useUserStore();
const token = userStore.token;
const user = userStore.user;
const memberId = ref(user.member_id);
const route = useRoute();
const params = route.params;
const id = params.id;
const member = ref({});
const monsters = ref([]);
const fields = [
  {
    type: "search",
    name: "search",
    placeholder: t("monster_name"),
  },
];
const filters = reactive([
  {
    fields: [
      {
        label: t("display_non_invocable_monsters"),
        attributes: {
          type: "checkbox",
          name: "is_fusion_shop",
          checked: true,
        },
      },
    ],
  },
  {
    title: t("elements"),
    fields: [
      {
        label: t("fire"),
        attributes: {
          type: "checkbox",
          name: "fire",
          checked: true,
        },
      },
      {
        label: t("water"),
        attributes: {
          type: "checkbox",
          name: "water",
          checked: true,
        },
      },
      {
        label: t("wind"),
        attributes: {
          type: "checkbox",
          name: "wind",
          checked: true,
        },
      },
      {
        label: t("light"),
        attributes: {
          type: "checkbox",
          name: "light",
          checked: true,
        },
      },
      {
        label: t("dark"),
        attributes: {
          type: "checkbox",
          name: "dark",
          checked: true,
        },
      },
    ],
  },
  {
    title: t("natural_grade"),
    fields: [
      {
        label: t("nb_stars", { number: 2 }),
        attributes: {
          type: "checkbox",
          name: "2_stars",
          checked: true,
        },
      },
      {
        label: t("nb_stars", { number: 3 }),
        attributes: {
          type: "checkbox",
          name: "3_stars",
          checked: true,
        },
      },
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
const loading = ref(true);
const keyword = ref("");
const sortOptions = [
  {
    value: "element",
    text: t("element"),
  },
  {
    value: "quantity",
    text: t("quantity"),
  },
  {
    value: "grade",
    text: t("natural_grade"),
  },
  {
    value: "name",
    text: t("name"),
  },
];
const actualSort = ref("element");
const userIsTheMember = ref(false);
const alert = reactive({
  display: false,
  type: "",
  message: "",
});

provide("monsters", monsters);
provide("fields", fields);
provide("filters", filters);
provide("filtersValues", filtersValues);
provide("loading", loading);
provide("sortOptions", sortOptions);
provide("sortValue", actualSort);

function initPage() {
  if (id && memberId.value !== id) {
    memberId.value = id;
  } else {
    memberId.value = user.member_id;
    userIsTheMember.value = true;
  }

  getMember();
}

initPage();

watch(
  () => route.path,
  () => {
    initPage();
  },
);

async function getMember() {
  const result = await fetch(`${env.VITE_URL}/api/members/${memberId.value}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Accept-Language": userStore.language,
    },
  });

  if (result.ok) {
    const resultJson = await result.json();

    member.value = resultJson.member;
    monsters.value = resultJson.monsters;
    loading.value = false;
  }
}

async function searchMonsters(inputName, value) {
  if (inputName === "search") {
    keyword.value = value;
  } else if (inputName === "sortGrid") {
    actualSort.value = value;
  } else {
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
  }

  let body;

  if (keyword.value) {
    body = {
      keyword: keyword.value,
    };
  }

  if (Object.keys(filtersValues.value).length > 0) {
    body = {
      ...body,
      filters: filtersValues.value,
    };
  }

  body = {
    ...body,
    sort: actualSort.value,
  };

  const result = await fetch(
    `${env.VITE_URL}/api/boxes/${memberId.value}/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": userStore.language,
      },
      body: JSON.stringify(body),
    },
  );

  if (result.ok) {
    monsters.value = await result.json();
  }
}

async function sort(key) {
  if (key === actualSort.value) {
    return;
  }

  actualSort.value = key;

  if (key !== "element") {
    if (key === "quantity") {
      monsters.value = monsters.value.sort((a, b) => b.quantity - a.quantity);
    } else if (key === "grade") {
      monsters.value = monsters.value.sort(
        (a, b) => b.natural_grade - a.natural_grade,
      );
    } else if (key === "name") {
      monsters.value = monsters.value.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    }
  } else {
    const elementsOrder = ["fire", "water", "wind", "light", "dark"];
    monsters.value = monsters.value.sort((a, b) => {
      if (a.element === b.element) {
        return b.natural_grade - a.natural_grade;
      }
      return (
        elementsOrder.indexOf(a.element) - elementsOrder.indexOf(b.element)
      );
    });
  }
}

async function updateMember(inputName, value) {
  const formData = new FormData();
  formData.append("image", value);

  const result = await fetch(`${env.VITE_URL}/api/users/update-profile`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Accept-Language": userStore.language,
    },
    body: formData,
  });

  const resultJson = await result.json();

  if (result.ok) {
    userStore.updateUser(resultJson.user);
  } else {
    alert.display = true;
    alert.type = "error";

    if (resultJson.errors) {
      alert.message = resultJson.errors;
    } else {
      alert.message = resultJson.message;
    }
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
      :userIsTheMember="userIsTheMember"
      @updateImage="updateMember"
    />
    <Monsters @search="searchMonsters" @sortGrid="sort" />
    <Alert
      :display="alert.display"
      :type="alert.type"
      :message="alert.message"
    />
  </main>
</template>
