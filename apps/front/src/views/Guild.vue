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
const actualSort = ref("grade");
const data = ref({});
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

provide("fields", fields);
provide("columns", columns);
provide("sortOptions", sortOptions);
provide("sortValue", actualSort);
provide("data", data);
provide("loading", loading);

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
    data.value = {
      rows: resultJson.members,
      link: "/member/",
      badges: ["lds"],
      actions: actions,
    };
    members.value = resultJson.members;
    guild.value = resultJson.guild;
    loading.value = false;
  }
}

if (params.id && user.role === "admin") {
  guildId.value = params.id;
}

getMembers();

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

  if (key === "picture" || key === "actions") {
    return;
  } else if (actualSort.value === key) {
    members.value = members.value.reverse();
  } else if (key === "grade") {
    const gradeOrder = ["leader", "vice-leader", "senior", "member"];

    members.value = members.value.sort((a, b) => {
      return gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade);
    });
    actualSort.value = key;
  } else {
    members.value = members.value.sort(ascendingSort);
    actualSort.value = key;
  }

  toggleSortOrder(columns);
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
          name: actualSort.value,
          order: columns.find((column) => column.key === actualSort.value)
            .sortOrder,
        },
      }),
    },
  );

  if (result.ok) {
    const resultJson = await result.json();
    data.value = {
      rows: resultJson.members,
      link: "/member/",
      badges: ["lds"],
      actions: actions,
    };
    members.value = resultJson.members;
  }
}

function sortGrid(key) {
  sort(key);
  actualSort.value = key;
}
</script>

<template>
  <main class="guild">
    <GuildProfile :name="guild.name" :image="guild.image" />
    <TableGrid
      @sort="sort"
      @actionSelected="actionSelected"
      @search="madeSearch"
      @sortGrid="sortGrid"
    />
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
