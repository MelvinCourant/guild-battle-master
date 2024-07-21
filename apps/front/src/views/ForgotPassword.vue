<script setup>
import "../assets/css/views/_login-register.scss";
import FormPage from "../components/FormPage.vue";
import { provide, reactive, ref } from "vue";
import Alert from "../components/utils/Alert.vue";

const env = import.meta.env;
const forgotPasswordForm = reactive({
  title: "Mot de passe oublié",
  forms: [
    {
      id: 1,
      fields: [
        {
          label: "Email*",
          attributes: {
            type: "email",
            name: "email",
            required: true,
            autocomplete: "email",
          },
        },
        {
          attributes: {
            type: "submit",
            value: "Envoyer",
            style: "primary",
          },
        },
      ],
    },
  ],
});
const alert = reactive({
  display: false,
  message: "",
});
const email = ref("");

provide("formContainer", forgotPasswordForm);

function updateValue(inputName, value) {
  email.value = value;
}

async function sendEmail(event) {
  const result = await fetch(`${env.VITE_URL}/api/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.value,
    }),
  });

  const resultJson = await result.json();

  if (result.ok) {
    alert.display = true;
    alert.type = "success";
    alert.message = resultJson.message;
    console.log(alert);
  } else {
    forgotPasswordForm.forms[0].fields[0].error = resultJson.message;
  }
}
</script>

<template>
  <main class="forgot-password">
    <FormPage @sendValue="updateValue" @submit="sendEmail" />
    <Alert
      :display="alert.display"
      :type="alert.type"
      :message="alert.message"
      @close="alert.display = false"
    />
  </main>
</template>
