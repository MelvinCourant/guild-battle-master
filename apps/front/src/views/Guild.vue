<script setup>
import "../assets/css/views/_guild.scss";
import { provide, reactive, ref } from "vue";
import { useUserStore } from "../stores/user.js";
import GuildProfile from "../components/GuildProfile.vue";
import Dialog from "../components/utils/Dialog.vue";
import Alert from "../components/utils/Alert.vue";
import TableGrid from "../components/utils/TableGrid.vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import FiltersBar from "../components/utils/FiltersBar.vue";
import Table from "../components/tables/Table.vue";
import TableRows from "../components/tables/TableRows.vue";
import Avatar from "../components/utils/Avatar.vue";
import { usePreferencesStore } from "../stores/preferences.js";
import Grade from "../components/utils/Grade.vue";
import Badge from "../components/utils/Badge.vue";
import More from "../components/utils/More.vue";
import Grid from "../components/grids/Grid.vue";
import GridCard from "../components/grids/GridCard.vue";

const { t } = useI18n();
const userStore = useUserStore();
const user = userStore.user;
const token = userStore.token;
const env = import.meta.env;
const fields = [
  {
    type: "search",
    name: "search",
    placeholder: "Grade, pseudo, etc.",
  },
];
const columns = reactive([
  {
    name: "",
    key: "picture",
    class: "table-grid__picture",
  },
  {
    name: "Pseudo",
    key: "pseudo",
    class: "table-grid__pseudo",
    sortOrder: "",
  },
  {
    name: "Grade",
    key: "grade",
    class: "table-grid__grade",
    sortOrder: "asc",
  },
  {
    name: t("role"),
    key: "role",
    class: "table-grid__role",
    sortOrder: "",
  },
  {
    name: t("lds_nat_5"),
    key: "lds",
    class: "table-grid__lds",
    sortOrder: "",
  },
  {
    name: "",
    key: "actions",
    class: "table__actions",
  },
]);
const sortOptions = [
  {
    value: "pseudo",
    text: "Pseudo",
  },
  {
    value: "grade",
    text: "Grade",
  },
  {
    value: "role",
    text: t("role"),
  },
  {
    value: "lds",
    text: t("lds_nat_5"),
  },
];
const actualSort = reactive({
  key: "grade",
  order: "asc",
});
const actions = [
  {
    name: "update",
    label: t("update"),
    permissions: [
      {
        role: "leader",
        canModify: ["all"],
      },
      {
        role: "moderator",
        canModify: ["all"],
      },
    ],
    danger: false,
  },
  {
    name: "role",
    label: t("assign_role"),
    permissions: [
      {
        role: "leader",
        canModify: ["moderator", "member"],
      },
    ],
    danger: false,
  },
  {
    name: "exclude",
    label: t("exclude"),
    permissions: [
      {
        role: "leader",
        canModify: ["all"],
      },
      {
        role: "moderator",
        canModify: [""],
      },
    ],
    danger: true,
  },
];
const members = ref([]);
const memberSelected = ref({});
const guild = ref({});
const dialog = reactive({
  image: {
    src: "",
    alt: "",
  },
  content: {
    title: "",
    description: "",
  },
  fields: [
    {
      type: "button",
      name: "cancel",
      value: t("cancel"),
    },
    {
      type: "button",
      name: "exclude",
      value: t("exclude"),
      style: "danger",
    },
  ],
});
const dialogIsOpen = ref(false);
const alert = reactive({
  display: false,
  type: "",
  message: "",
});
const loading = ref(true);
const router = useRouter();
const route = useRoute();
const params = route.params;
const roleSelected = ref("");
const guildId = ref(user.guild_id);
const preferencesStore = usePreferencesStore();
const preferences = preferencesStore.preferences;
const displayModes = reactive([
  {
    name: "list",
    isSelected: true,
  },
  {
    name: "grid",
    isSelected: false,
  },
]);

provide("fields", fields);
provide("columns", columns);
provide("sortOptions", sortOptions);
provide("sortValue", actualSort.key);
provide("loading", loading);
provide("displayModes", displayModes);

async function getMembers() {
  const result = await fetch(`${env.VITE_URL}/api/guilds/${guildId.value}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Accept-Language": userStore.language,
    },
  });

  if (result.ok) {
    const resultJson = await result.json();

    members.value = resultJson.members;
    guild.value = resultJson.guild;

    if (actualSort.key !== "grade") {
      sort(actualSort.key, actualSort.order);
    }

    loading.value = false;
  }
}

if (params.id && user.role === "admin") {
  guildId.value = params.id;
}

getMembers();

function sort(key, order = "") {
  function ascendingSort(a, b) {
    if (a[key] < b[key]) {
      return -1;
    }
    if (a[key] > b[key]) {
      return 1;
    }
    return 0;
  }

  function descendingSort(a, b) {
    if (a[key] > b[key]) {
      return -1;
    }
    if (a[key] < b[key]) {
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
        actualSort.order = "asc";
      } else if (column.key === key && column.sortOrder === "asc") {
        column.sortOrder = "desc";
        actualSort.order = "desc";
      } else {
        column.sortOrder = "";
      }
    });
  }

  if (key === "picture" || key === "actions") {
    return;
  } else if (actualSort.key === key && !order) {
    members.value = members.value.reverse();
  } else if (
    (key === "grade" && !order) ||
    (key === "grade" && order === "asc")
  ) {
    const gradeOrder = ["leader", "vice-leader", "senior", "member"];

    members.value = members.value.sort((a, b) => {
      return gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade);
    });
    actualSort.key = key;
  } else if (order === "desc") {
    members.value = members.value.sort(descendingSort);
    actualSort.key = key;
  } else {
    members.value = members.value.sort(ascendingSort);
    actualSort.key = key;
  }

  if (!order) {
    toggleSortOrder(columns);
  }
}

function actionSelected(selection) {
  const action = selection.action;
  const memberId = selection.id;

  if (action === "update") {
    if (user.role === "member") {
      return;
    }

    router.push(`/upload-json/${memberId}`);
  } else if (action === "exclude") {
    if (user.role === "member") {
      return;
    }

    memberSelected.value = members.value.find(
      (member) => member.id === memberId,
    );

    dialog.image = {
      src: memberSelected.value.image,
      alt: memberSelected.value.pseudo,
    };
    dialog.content = {
      title: t("exclude_member_from_guild", {
        pseudo: memberSelected.value.pseudo,
      }),
      description: t("exclude_dialog_description"),
    };
    dialogIsOpen.value = true;
  } else {
    if (user.role === "" || user.role !== "leader") {
      return;
    }

    memberSelected.value = members.value.find(
      (member) => member.id === memberId,
    );

    let roleOptions = [];

    if (memberSelected.value.role === "member") {
      roleOptions = [
        {
          value: "leader",
          text: "Leader",
        },
        {
          value: "moderator",
          text: "Moderator",
        },
      ];
      roleSelected.value = "moderator";
    } else {
      roleOptions = [
        {
          value: "leader",
          text: "Leader",
        },
        {
          value: "member",
          text: "Member",
        },
      ];
      roleSelected.value = "member";
    }

    dialog.image = {
      src: memberSelected.value.image,
      alt: memberSelected.value.pseudo,
    };
    dialog.content = {
      title: t("assign_role_to", {
        pseudo: memberSelected.value.pseudo,
      }),
      description: t("choose_role_dialog_description", {
        pseudo: memberSelected.value.pseudo,
      }),
      select: {
        options: roleOptions,
        value: roleSelected.value,
      },
    };
    dialog.fields = [
      {
        type: "button",
        name: "cancel",
        value: t("cancel"),
      },
      {
        type: "button",
        name: "role",
        value: t("assign"),
        style: "primary",
      },
    ];
    dialogIsOpen.value = true;
  }
}

async function dialogResponse(name) {
  if (name === "exclude") {
    const result = await fetch(
      `${env.VITE_URL}/api/members/${memberSelected.value.id}/exclude`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Accept-Language": userStore.language,
        },
      },
    );
    const resultJson = await result.json();

    if (result.ok) {
      await getMembers();
      dialogIsOpen.value = false;
      alert.display = true;
      alert.type = "success";
      alert.message = resultJson.message;
    } else {
      alert.display = true;
      alert.type = "error";
      alert.message = resultJson.message;
    }
  } else if (name === "role") {
    const result = await fetch(
      `${env.VITE_URL}/api/members/${memberSelected.value.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Accept-Language": userStore.language,
        },
        body: JSON.stringify({
          role: roleSelected.value,
        }),
      },
    );
    const resultJson = await result.json();

    if (result.ok) {
      await getMembers();
      dialogIsOpen.value = false;
      alert.display = true;
      alert.type = "success";
      alert.message = resultJson.message;
    } else {
      alert.display = true;
      alert.type = "error";
      alert.message = resultJson.message;
    }
  } else {
    dialogIsOpen.value = false;
  }
}

async function madeSearch(inputName, value) {
  if (value === "") {
    await getMembers();
    return;
  }

  const result = await fetch(
    `${env.VITE_URL}/api/guilds/${guildId.value}/members`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": userStore.language,
      },
      body: JSON.stringify({
        keyword: value,
        sort: {
          name: actualSort.key,
          order: columns.find((column) => column.key === actualSort.key)
            .sortOrder,
        },
      }),
    },
  );

  if (result.ok) {
    const resultJson = await result.json();

    members.value = resultJson.members;
  }
}

if (preferences.displayMode) {
  displayModes.forEach((displayMode) => {
    if (displayMode.name === preferences.displayMode) {
      displayMode.isSelected = true;
      preferencesStore.updatePreferences("displayMode", displayMode.name);
    } else {
      displayMode.isSelected = false;
    }
  });
}

function toggleModeSelectedMobile() {
  if (window.innerWidth <= 991 && displayModes[0].isSelected) {
    displayModes[0].isSelected = false;
    displayModes[1].isSelected = true;
  }
}

if (window.innerWidth <= 768 && displayModes[0].isSelected) {
  toggleModeSelectedMobile();
}

window.addEventListener("resize", toggleModeSelectedMobile);

function updateDisplayMode(mode) {
  displayModes.forEach((displayMode) => {
    if (displayMode.name === mode) {
      displayMode.isSelected = true;
      preferencesStore.updatePreferences("displayMode", displayMode.name);
    } else {
      displayMode.isSelected = false;
    }
  });
}

function othersText(numberMonsters) {
  if (numberMonsters - 3 > 1) {
    return `+${numberMonsters - 3} ${t("others")}`;
  } else {
    return `+1 ${t("other")}`;
  }
}
</script>

<template>
  <main class="guild">
    <GuildProfile :name="guild.name" :image="guild.image" />
    <TableGrid>
      <FiltersBar @search="madeSearch" @modeSelected="updateDisplayMode" />
      <Table
        v-show="
          displayModes.find((displayMode) => displayMode.isSelected).name ===
          'list'
        "
        @sort="sort"
      >
        <TableRows :rows="members">
          <template #default="{ row }">
            <td class="table-grid__picture">
              <router-link :to="`/member/${row.id}`"
                ><Avatar
                  className="table-rows__image"
                  :src="row.image"
                  :alt="row.pseudo"
                  :disableSkeleton="true"
                />
              </router-link>
            </td>
            <td class="table-grid__pseudo">
              <router-link :to="`/member/${row.id}`"
                ><span>{{ row.pseudo }}</span></router-link
              >
            </td>
            <td class="table-grid__grade">
              <div class="table-grid__grade-name">
                <Grade v-if="row.grade !== 'member'" :grade="row.grade" />
                <span>{{ row.grade }}</span>
              </div>
            </td>
            <td class="table-grid__role">
              {{ row.role }}
            </td>
            <td class="table-grid__lds">
              <ul>
                <template v-for="(monster, index) in row.lds">
                  <Badge
                    v-if="index < 3"
                    :key="monster.unit_master_id"
                    :monstersIds="[monster.unit_master_id]"
                    :name="monster.name"
                    :element="monster.element"
                  />
                </template>
                <Badge
                  v-if="row.lds.length > 3"
                  :key="'others'"
                  :monstersIds="
                    row.lds.slice(3).map((monster) => monster.unit_master_id)
                  "
                  :name="othersText(row.lds.length)"
                  element="dark-light"
                />
              </ul>
            </td>
            <td class="table-rows__actions">
              <More
                v-if="row.id !== user.member_id"
                :actions="actions"
                :memberRole="row.role"
                @actionSelected="actionSelected({ action: $event, id: row.id })"
              />
            </td>
          </template>
        </TableRows>
      </Table>
      <Grid
        v-show="
          displayModes.find((displayMode) => displayMode.isSelected).name ===
          'grid'
        "
        @sortGrid="sort"
      >
        <GridCard v-for="row in members" :key="row.id">
          <div class="grid-card__actions-container">
            <div class="grid-card__actions" v-if="row.id !== user.member_id">
              <More
                :actions="actions"
                :memberRole="row.role"
                orientation="right"
                @actionSelected="actionSelected({ action: $event, id: row.id })"
              />
            </div>
          </div>
          <router-link :to="`/member/${row.id}`"
            ><Avatar
              className="table-grid__picture"
              :src="row.image"
              :alt="row.pseudo"
              :disableSkeleton="true"
            />
          </router-link>
          <router-link :to="`/member/${row.id}`">
            <span class="table-grid__pseudo">{{ row.pseudo }}</span>
          </router-link>
          <div class="table-grid__grade-name">
            <Grade v-if="row.grade !== 'member'" :grade="row.grade" />
            <span>{{ row.grade }}</span>
          </div>
          <span class="table-grid__role">{{ row.role }}</span>
          <ul class="table-grid__lds">
            <template v-for="(monster, index) in row.lds">
              <Badge
                v-if="index < 3"
                :key="monster.unit_master_id"
                :monstersIds="[monster.unit_master_id]"
                :name="monster.name"
                :element="monster.element"
              />
            </template>
            <Badge
              v-if="row.lds.length > 3"
              :key="'others'"
              :monstersIds="
                row.lds.slice(3).map((monster) => monster.unit_master_id)
              "
              :name="othersText(row.lds.length)"
              element="dark-light"
            />
          </ul>
        </GridCard>
      </Grid>
    </TableGrid>
  </main>
  <Dialog
    :dialog="dialog"
    :isOpen="dialogIsOpen"
    @click="dialogResponse"
    @close="dialogIsOpen = false"
    @change="
      roleSelected = $event;
      dialog.content.select.value = roleSelected;
    "
  />
  <Alert
    :display="alert.display"
    :type="alert.type"
    :message="alert.message"
    @close="alert.display = false"
  />
</template>
