<script setup>
import "../assets/css/views/_guilds-list.scss";
import { useI18n } from "vue-i18n";
import { useUserStore } from "../stores/user.js";
import { provide, reactive, ref } from "vue";
import Table from "../components/tables/Table.vue";
import TableRows from "../components/tables/TableRows.vue";
import FiltersBar from "../components/utils/FiltersBar.vue";
import Pager from "../components/utils/Pager.vue";
import Avatar from "../components/utils/Avatar.vue";
import More from "../components/utils/More.vue";
import Alert from "../components/utils/Alert.vue";

const { t } = useI18n();
const userStore = useUserStore();
const token = userStore.token;
const env = import.meta.env;
const pageSize = ref(25);
const fields = [
  {
    type: "search",
    name: "search",
    placeholder: t("search_guild"),
  },
];
const columns = reactive([
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
    name: "Leader",
    key: "leader",
    class: "table-grid__leader",
    sortOrder: "",
  },
  {
    name: t("members"),
    key: "members",
    class: "table-grid__members",
    sortOrder: "",
  },
  {
    name: t("created_at"),
    key: "created_at",
    class: "table-grid__created-at",
    sortOrder: "desc",
  },
  {
    name: "",
    key: "actions",
    class: "table-grid__actions",
  },
]);
const sortOptions = [
  { value: "name", label: t("name") },
  { value: "leader", label: "Leader" },
  { value: "members", label: t("members") },
  { value: "created_at", label: t("created_at") },
];
const actualSort = ref("created_at");
const actions = [
  {
    name: "apply",
    label: t("apply"),
    danger: false,
  },
];
const guilds = ref([]);
const keyword = ref("");
const loading = ref(true);
const pager = reactive({
  currentPage: 1,
  lastPage: 1,
});
const alert = reactive({
  display: false,
  type: "",
  message: "",
});

provide("fields", fields);
provide("columns", columns);
provide("sortOptions", sortOptions);
provide("sortValue", actualSort);
provide("loading", loading);

function formatDatetime(datetime) {
  return new Date(datetime).toLocaleString(userStore.language);
}

async function getGuilds() {
  const result = await fetch(
    `${env.VITE_URL}/api/guilds/list-guilds/?page=${pager.currentPage}&pageSize=${pageSize.value}`,
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

    resultData = resultData.map((guild) => {
      return {
        id: guild.id,
        image: guild.image,
        name: guild.name,
        leader: guild.leader,
        members: guild.members,
        created_at: formatDatetime(guild.created_at),
      };
    });
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

  if (key === "picture") {
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

  keyword.value = value;

  const result = await fetch(`${env.VITE_URL}/api/guilds/search-guilds`, {
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

    resultData = resultData.map((guild) => {
      return {
        id: guild.id,
        image: guild.image,
        name: guild.name,
        leader: guild.leader,
        members: guild.members,
        created_at: formatDatetime(guild.created_at),
      };
    });
    guilds.value = resultData;
  }
}

function goToPage(page) {
  pager.currentPage = page;

  if (keyword.value === "") {
    getGuilds();
  } else {
    searchGuilds("search", keyword.value);
  }
}

function actionSelected(selection) {}
</script>

<template>
  <main class="guilds-list">
    <h1 class="hidden-title">{{ t("guilds_list") }}</h1>
    <FiltersBar @search="searchGuilds" />
    <Table @sort="sort">
      <TableRows :rows="guilds">
        <template #default="{ row }">
          <td class="table-grid__picture">
            <Avatar
              className="table-rows__image"
              :src="row.image"
              :alt="row.name"
              :disableSkeleton="true"
            />
          </td>
          <td class="table-grid__guild-name">
            <span>{{ row.name }}</span>
          </td>
          <td class="table-grid__leader">
            <span>{{ row.leader }}</span>
          </td>
          <td class="table-grid__members">
            <span>{{ row.members }}</span>
          </td>
          <td class="table-grid__created-at">
            <span>{{ row.created_at }}</span>
          </td>
          <td class="table-rows__actions">
            <More
              :actions="actions"
              @actionSelected="actionSelected({ action: $event, id: row.id })"
            />
          </td>
        </template>
      </TableRows>
    </Table>
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
    <Alert
      :display="alert.display"
      :type="alert.type"
      :message="alert.message"
      @close="alert.display = false"
    />
  </main>
</template>
