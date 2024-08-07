<script setup>
import "../assets/css/views/_login-register.scss";
import FormPage from "../components/FormPage.vue";
import { provide, reactive } from "vue";
import Alert from "../components/utils/Alert.vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUserStore } from "../stores/user";

const { t } = useI18n();
const userStore = useUserStore();
const env = import.meta.env;
const route = useRoute();
const token = route.query.token;
const email = route.query.email;
const router = useRouter();
const resetPasswordForm = reactive({
  title: t("reset_password"),
  forms: [
    {
      id: 1,
      fields: [
        {
          label: `${t("new_password")}*`,
          attributes: {
            type: "password",
            name: "password",
            required: true,
            autocomplete: "new-password",
          },
        },
        {
          label: `${t("confirm_password")}*`,
          attributes: {
            type: "password",
            name: "confirmationPassword",
            required: true,
            autocomplete: "new-password",
          },
        },
        {
          attributes: {
            type: "submit",
            value: t("reset"),
            style: "primary",
          },
        },
      ],
    },
  ],
  footerText: {
    text: t("expired_link"),
    link: t("make_new_request"),
    href: "/forgot-password",
  },
});
const alert = reactive({
  display: false,
  message: "",
});
const formValues = reactive({
  password: "",
  confirmationPassword: "",
});

provide("formContainer", resetPasswordForm);

function updateValue(inputName, value) {
  if (inputName === "password") {
    formValues.password = value;
  } else if (inputName === "confirmationPassword") {
    formValues.confirmationPassword = value;
  }
}

function displayError(fields, resultJson) {
  let errorsFields;
  let globalError;

  if (resultJson.errors) {
    errorsFields = resultJson.errors;
  } else {
    globalError = resultJson.message;
  }

  if (errorsFields) {
    errorsFields.forEach((error) => {
      fields.forEach((field) => {
        if (field.attributes.name === error.field) {
          field.error = error.message;
        }
      });
    });
  } else {
    alert.display = true;
    alert.type = "error";
    alert.message = globalError;
  }
}

async function resetPassword() {
  const result = await fetch(`${env.VITE_URL}/api/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": userStore.language,
    },
    body: JSON.stringify({
      token: token,
      email: email,
      password: formValues.password,
      password_confirmation: formValues.confirmationPassword,
    }),
  });

  if (result.ok) {
    await router.push("/login");
  } else {
    const resultJson = await result.json();

    displayError(resetPasswordForm.forms[0].fields, resultJson);
  }
}
</script>

<template>
  <main class="reset-password">
    <FormPage @submit="resetPassword" @sendValue="updateValue" />
    <Alert
      :display="alert.display"
      :type="alert.type"
      :message="alert.message"
      @close="alert.display = false"
    />
  </main>
</template>
