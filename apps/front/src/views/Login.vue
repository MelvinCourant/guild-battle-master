<script setup>
import "../assets/css/views/_login-register.scss";
import FormPage from "../components/FormPage.vue";
import Alert from "../components/utils/Alert.vue";
import { provide, reactive } from "vue";
import { useUserStore } from "../stores/user.js";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const env = import.meta.env;
const userStore = useUserStore();
const router = useRouter();

function generateImgSrc(src) {
  return new URL(`../assets/imgs/${src}`, import.meta.url).href;
}

const image = {
  src: generateImgSrc("camilla.jpg"),
  alt: "Login image",
};
const loginForm = reactive({
  title: "Guild battle Master",
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
          label: `${t("password")}*`,
          attributes: {
            type: "password",
            name: "password",
            required: true,
            autocomplete: "current-password",
          },
        },
        {
          attributes: {
            type: "submit",
            value: t("login"),
            style: "primary",
          },
        },
      ],
    },
  ],
  footerText: {
    text: t("dont_have_account"),
    link: t("sign_up"),
    href: "/register",
  },
  passwordForgotten: {
    text: t("forgot_password"),
    href: "/forgot-password",
  },
});
const fields = loginForm.forms[0].fields;
const formValues = reactive({
  email: "",
  password: "",
});
const alert = reactive({
  display: false,
  message: "",
});

provide("formContainer", loginForm);

function updateValue(inputName, value) {
  if (inputName === "email") {
    formValues.email = value;
  } else {
    formValues.password = value;
  }
}

function displayError(resultJson) {
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

async function login() {
  const submitButton = fields[2];
  submitButton.loading = t("loading");

  const result = await fetch(`${env.VITE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": userStore.language,
    },
    body: JSON.stringify({
      email: formValues.email,
      password: formValues.password,
    }),
  });
  const resultJson = await result.json();

  if (result.ok) {
    const user = resultJson.user;
    userStore.updateUser(user);

    const tokenObject = resultJson.token;
    const tokenValue = tokenObject.token;
    userStore.updateToken(tokenValue);

    await router.push("/");
  } else {
    displayError(resultJson);
  }

  submitButton.loading = "";
}
</script>

<template>
  <main class="login">
    <h1 class="hidden-title">{{ t("login") }}</h1>
    <FormPage :image="image" @sendValue="updateValue" @submit="login" />
    <Alert
      :display="alert.display"
      :type="alert.type"
      :message="alert.message"
      @close="alert.display = false"
    />
  </main>
</template>
