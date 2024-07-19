<script setup>
import "../assets/css/views/_upload-json.scss";
import FormPage from "../components/FormPage.vue";
import Alert from "../components/utils/Alert.vue";
import { provide, reactive, ref, watch } from "vue";
import { useUserStore } from "../stores/user.js";
import { useRoute, useRouter } from "vue-router";

const uploadJsonForm = reactive({
  title: "Met à jour ton profil",
  highlight: "",
  forms: [
    {
      id: 1,
      fields: [
        {
          label: "Parcourir",
          attributes: {
            type: "file",
            name: "json",
            accept: "application/JSON",
            style: "primary",
          },
        },
        {
          attributes: {
            type: "submit",
            value: "Importer",
            style: "primary",
          },
        },
      ],
    },
  ],
});

provide("formContainer", uploadJsonForm);

const env = import.meta.env;
const userStore = useUserStore();
const token = userStore.token;
const user = userStore.user;
const memberId = ref(user.member_id);
const isGuildUpload = ref(false);
const route = useRoute();
const router = useRouter();
const params = route.params;
const id = params.id;
const json = ref(null);
const alert = reactive({
  display: false,
  message: "",
});

async function verifyUploadPermissions() {
  const result = await fetch(
    `${env.VITE_URL}/api/members/${memberId.value}/verify-upload-permissions`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const resultJson = await result.json();

  if (result.ok) {
    uploadJsonForm.title = "Mettre à jour";
    uploadJsonForm.highlight = resultJson.pseudo;
  } else {
    await router.push("/upload-json");
  }
}

function initPage() {
  if (route.path !== "/upload-json/guild" && id && memberId.value !== id) {
    memberId.value = id;
    verifyUploadPermissions();
  } else if (route.path === "/upload-json/guild") {
    isGuildUpload.value = true;
    uploadJsonForm.title = "Mettre à jour";
    uploadJsonForm.highlight = "la guilde";
  } else {
    isGuildUpload.value = false;
    memberId.value = user.member_id;
    uploadJsonForm.title = "Met à jour ton profil";
    uploadJsonForm.highlight = "";
  }
}

initPage();

watch(
  () => route.path,
  () => {
    initPage();
  },
);

function updateValue(inputName, value) {
  json.value = value;
}

async function uploadJson() {
  if (!json.value) {
    alert.display = true;
    alert.message = "Veuillez sélectionner un fichier JSON";
    alert.type = "error";

    return;
  }

  const formData = new FormData();
  formData.append("json", json.value);

  uploadJsonForm.forms[0].fields[1].loading = "Chargement...";

  let url = `${env.VITE_URL}/api/members/${memberId.value}`;

  if (isGuildUpload.value) {
    url = `${env.VITE_URL}/api/guilds`;
  }

  const result = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const resultJson = await result.json();

  uploadJsonForm.forms[0].fields[1].loading = "";

  if (result.ok) {
    alert.display = true;
    alert.message = resultJson.message;
    alert.type = "success";

    if (isGuildUpload.value) {
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } else {
      setTimeout(() => {
        router.push("/member/" + memberId.value);
      }, 3000);
    }
  } else {
    alert.display = true;
    alert.type = "error";

    if (resultJson.error) {
      alert.message = resultJson.message;
    } else {
      alert.message = resultJson.errors[0].message;
    }
  }
}
</script>

<template>
  <main class="upload-json">
    <h1 class="hidden-title">Importer un JSON</h1>
    <FormPage @sendValue="updateValue" @submit="uploadJson" />
    <Alert
      :display="alert.display"
      :type="alert.type"
      :message="alert.message"
      @close="alert.display = false"
    />
  </main>
</template>
