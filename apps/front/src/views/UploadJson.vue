<script setup>
import '../assets/css/views/_upload-json.scss';
import FormPage from "../components/FormPage.vue";
import Alert from "../components/utils/Alert.vue";
import {provide, reactive, ref} from "vue";
import { useUserStore } from "../stores/user.js";
import { useRoute, useRouter } from 'vue-router';

const uploadJsonForm = reactive({
  title: 'Met à jour ton profil',
  highlight: '',
  forms: [
    {
      id: 1,
      fields: [
        {
          label: 'Parcourir',
          attributes: {
            type: 'file',
            name: 'json',
            accept: 'application/JSON',
            style: 'primary',
          }
        },
        {
          attributes: {
            type: 'submit',
            value: 'Importer',
            style: 'primary',
          }
        }
      ]
    }
  ]
});

provide('formContainer', uploadJsonForm);

const env = import.meta.env;
const userStore = useUserStore();
const token = userStore.token;
const user = userStore.user;
const memberId = ref(user.member_id);
const route = useRoute();
const router = useRouter();
const params = route.params;
const id = parseInt(params.id);
const json = ref(null);
const alert = reactive({
  display: false,
  message: '',
});

async function verifyUploadPermissions() {
  const result = await fetch(`${env.VITE_URL}/api/members/${memberId.value}/verify-upload-permissions`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const resultJson = await result.json();

  if (result.ok) {
    uploadJsonForm.title = 'Mettre à jour';
    uploadJsonForm.highlight = resultJson.pseudo;
  } else {
    await router.push('/upload-json');
  }
}

if(
    id &&
    memberId.value !== id
) {
  memberId.value = id;
  verifyUploadPermissions();
}

function updateValue(inputName, value) {
  json.value = value;
}

async function uploadJson() {
  if (!json.value) {
    alert.display = true;
    alert.message = 'Veuillez sélectionner un fichier JSON';
    alert.type = 'error';

    setTimeout(() => {
      alert.display = false;
    }, 3000);

    return;
  }

  const formData = new FormData();
  formData.append('json', json.value);

  uploadJsonForm.forms[0].fields[1].loading = 'Chargement...';
  const result = await fetch(`${env.VITE_URL}/api/members/${memberId.value}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  const resultJson = await result.json();

  uploadJsonForm.forms[0].fields[1].loading = '';

  if (result.ok) {
    alert.display = true;
    alert.message = resultJson.message;
    alert.type = 'success';

    setTimeout(() => {
      alert.display = false;
    }, 3000);
  } else {
    alert.display = true;
    alert.type = 'error';

    if (resultJson.error) {
      alert.message = resultJson.error;
    } else {
      alert.message = resultJson.errors[0].message;
    }

    setTimeout(() => {
      alert.display = false;
    }, 3000);
  }
}
</script>

<template>
  <main class="upload-json">
    <FormPage
        @sendValue="updateValue"
        @submit="uploadJson"
    />
    <Alert
        :display="alert.display"
        :type="alert.type"
        :message="alert.message"
    />
  </main>
</template>