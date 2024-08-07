<script setup>
import "../../assets/css/views/admin/_admin-users.scss";
import { useI18n } from "vue-i18n";
import { useUserStore } from "../../stores/user.js";
import { provide, reactive, ref } from "vue";
import Table from "../../components/tables/Table.vue";
import FiltersBar from "../../components/utils/FiltersBar.vue";
import Pager from "../../components/utils/Pager.vue";

const { t } = useI18n();
const userStore = useUserStore();
const token = userStore.token;
const env = import.meta.env;
const pageSize = ref(25);
const fields = [
  {
    type: "search",
    name: "search",
    placeholder: t("search_user"),
  },
];
const columns = reactive([
  {
    name: "ID",
    key: "id",
    class: "table-grid__id",
  },
  {
    name: "",
    key: "picture",
    class: "table-grid__picture",
  },
  {
    name: t("username"),
    key: "name",
    class: "table-grid__username",
    sortOrder: "",
  },
  {
    name: "Pseudo",
    key: "pseudo",
    class: "table-grid__pseudo",
    sortOrder: "",
  },
  {
    name: t("guild_name"),
    key: "guild_name",
    class: "table-grid__guild-name",
    sortOrder: "",
  },
  {
    name: t("created_at"),
    key: "created_at",
    class: "table-grid__created-at",
    sortOrder: "desc",
  },
]);
const sortOptions = [
  { value: "username", label: t("username") },
  { value: "pseudo", label: "Pseudo" },
  { value: "guild_name", label: t("guild_name") },
  { value: "created_at", label: t("created_at") },
];
const actualSort = ref("created_at");
const data = ref({});
const users = ref([]);
const keyword = ref("");
const loading = ref(true);
const pager = reactive({
  currentPage: 1,
  lastPage: 1,
});

provide("fields", fields);
provide("columns", columns);
provide("sortOptions", sortOptions);
provide("sortValue", actualSort);
provide("data", data);
provide("loading", loading);

function formatDatetime(datetime) {
  return new Date(datetime).toLocaleString(userStore.language);
}

async function getUsers() {
  const result = await fetch(
    `${env.VITE_URL}/api/admin/list-users/?page=${pager.currentPage}&pageSize=${pageSize.value}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": userStore.language,
      },
    },
  );

  if (result.ok) {
    const resultJson = await result.json();
    const resultMeta = resultJson.meta;

    pager.currentPage = resultMeta.current_page;
    pager.lastPage = resultMeta.last_page;

    let resultData = resultJson.data;

    resultData = resultData.map((user) => {
      return {
        id: user.id,
        image: user.image,
        username: user.username,
        pseudo: user.pseudo,
        guild_name: user.guild_name,
        created_at: formatDatetime(user.created_at),
      };
    });

    data.value = {
      rows: resultData,
    };
    users.value = resultData;
    loading.value = false;
  }
}

getUsers();

function sort(key) {
  function ascendingSort(a, b) {
    if (a[key] < b[key]) {
      return -1;
    }
    if (a[key] > b[key]) {
      return 1;
    }
    return 0;
  }

  function toggleSortOrder(columns) {
    columns.forEach((column) => {
      if (
        (column.key === key && column.sortOrder === "") ||
        (column.key === key && column.sortOrder === "desc")
      ) {
        column.sortOrder = "asc";
      } else if (column.key === key && column.sortOrder === "asc") {
        column.sortOrder = "desc";
      } else {
        column.sortOrder = "";
      }
    });
  }

  if (key === "picture" || key === "id") {
    return;
  } else if (actualSort.value === key) {
    users.value = users.value.reverse();
  } else {
    users.value = users.value.sort(ascendingSort);
    actualSort.value = key;
  }

  toggleSortOrder(columns);
}

async function searchUsers(inputName, value) {
  if (value === "") {
    await getUsers();
    return;
  }

  keyword.value = value;

  const result = await fetch(`${env.VITE_URL}/api/admin/search-users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Accept-Language": userStore.language,
    },
    body: JSON.stringify({
      keyword: keyword.value,
      sort: {
        name: actualSort.value,
        order: columns.find((column) => column.key === actualSort.value)
          .sortOrder,
      },
    }),
  });

  if (result.ok) {
    const resultJson = await result.json();
    const resultMeta = resultJson.meta;

    pager.currentPage = resultMeta.current_page;
    pager.lastPage = resultMeta.last_page;

    let resultData = resultJson.data;

    resultData = resultData.map((user) => {
      return {
        id: user.id,
        image: user.image,
        username: user.username,
        pseudo: user.pseudo,
        guild_name: user.guild_name,
        created_at: formatDatetime(user.created_at),
      };
    });

    data.value = {
      rows: resultData,
    };
    users.value = resultData;
  }
}

function goToPage(page) {
  pager.currentPage = page;

  if (keyword.value === "") {
    getUsers();
  } else {
    searchUsers("search", keyword.value);
  }
}
</script>

<template>
  <main class="admin-users">
    <h1 class="hidden-title">{{ t("admin_list_users") }}</h1>
    <FiltersBar @search="searchUsers" />
    <Table @sort="sort" />
    <Pager
      v-if="pager && pager.lastPage > 1"
      :currentPage="pager.currentPage"
      :lastPage="pager.lastPage"
      @gotToFirstPage="() => goToPage(1)"
      @goToPreviousPage="() => goToPage(pager.currentPage - 1)"
      @goToPage="goToPage"
      @goToNextPage="() => goToPage(pager.currentPage + 1)"
      @goToLastPage="() => goToPage(pager.lastPage)"
    />
  </main>
</template>
