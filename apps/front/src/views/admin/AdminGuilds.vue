<script setup>
import "../../assets/css/views/admin/_admin-guilds.scss";
import { useI18n } from "vue-i18n";
import TableGrid from "../../components/utils/TableGrid.vue";
import { useUserStore } from "../../stores/user.js";
import { provide, reactive, ref } from "vue";
import Table from "../../components/tables/Table.vue";
import FiltersBar from "../../components/utils/FiltersBar.vue";

const { t } = useI18n();
const userStore = useUserStore();
const token = userStore.token;
const env = import.meta.env;
const page = ref(1);
const pageSize = ref(25);
const fields = [
  {
    type: "search",
    name: "search",
    placeholder: "Nom de guilde ou pseudo du leader",
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
    name: t("name"),
    key: "name",
    class: "table-grid__guild-name",
    sortOrder: "",
  },
  {
    name: "Guild ID JSON",
    key: "guild_id_json",
    class: "table-grid__guild-id-json",
    sortOrder: "",
  },
  {
    name: "Leader",
    key: "leader",
    class: "table-grid__leader",
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
  { value: "name", label: t("name") },
  { value: "guild_id_json", label: "Guild ID JSON" },
  { value: "leader", label: "Leader" },
  { value: "created_at", label: t("created_at") },
];
const actualSort = ref("created_at");
const data = ref({});
const guilds = ref([]);
const loading = ref(true);

provide("fields", fields);
provide("columns", columns);
provide("sortOptions", sortOptions);
provide("sortValue", actualSort);
provide("data", data);
provide("loading", loading);

function formatDatetime(datetime) {
  return new Date(datetime).toLocaleString(userStore.language);
}

async function getGuilds() {
  const result = await fetch(
    `${env.VITE_URL}/api/admin/list-guilds/?page=${page.value}&pageSize=${pageSize.value}`,
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
    let resultData = resultJson.data;
    resultData = resultData.map((guild) => {
      return {
        id: guild.id,
        image: guild.image,
        name: guild.name,
        guild_id_json: guild.guild_id_json,
        leader: guild.leader,
        created_at: formatDatetime(guild.created_at),
      };
    });

    data.value = {
      rows: resultData,
      link: "/guild/",
    };
    guilds.value = resultData;
    loading.value = false;
  }
}

getGuilds();

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
    guilds.value = guilds.value.reverse();
  } else {
    guilds.value = guilds.value.sort(ascendingSort);
    actualSort.value = key;
  }

  toggleSortOrder(columns);
}

async function searchGuilds(inputName, value) {
  if (value === "") {
    await getGuilds();
    return;
  }

  const result = await fetch(`${env.VITE_URL}/api/admin/search-guilds`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Accept-Language": userStore.language,
    },
    body: JSON.stringify({
      keyword: value,
      sort: {
        name: actualSort.value,
        order: columns.find((column) => column.key === actualSort.value)
          .sortOrder,
      },
    }),
  });

  if (result.ok) {
    const resultJson = await result.json();
    let resultData = resultJson.data;
    resultData = resultData.map((guild) => {
      return {
        id: guild.id,
        image: guild.image,
        name: guild.name,
        guild_id_json: guild.guild_id_json,
        leader: guild.leader,
        created_at: formatDatetime(guild.created_at),
      };
    });

    data.value = {
      rows: resultData,
      link: "/guild/",
    };
    guilds.value = resultData;
  }
}
</script>

<template>
  <main class="admin-guilds">
    <h1 class="hidden-title">{{ t("admin_list_guilds") }}</h1>
    <FiltersBar @search="searchGuilds" />
    <Table @sort="sort" />
  </main>
</template>
