<script setup lang="ts">
  import '@css/views/login-register.scss';
  import FormPage from "@components/FormPage.vue";
  import Alert from "@components/utils/Alert.vue";
  import { IImage, IFormContainer } from "@models/form.ts";
  import { IAlert } from "@models/alert.ts";
  import { provide, reactive } from "vue";
  const env = import.meta.env;

  function generateImgSrc(src: string) {
    return new URL(`../assets/imgs/${src}`, import.meta.url).href;
  }

  const image: IImage = {
    src: generateImgSrc("camilla.jpg"),
    alt: 'Login image',
  }
  const loginForm: IFormContainer = {
    title: 'Guild battle Master',
    forms: [
      {
        id: 1,
        fields: [
          {
            label: 'Email*',
            attributes: {
              type: 'email',
              name: 'email',
              required: true,
              autocomplete: 'email',
            }
          },
          {
            label: 'Mot de passe*',
            attributes: {
              type: 'password',
              name: 'password',
              required: true,
              autocomplete: 'current-password',
            }
          },
          {
            attributes: {
              type: 'submit',
              value: 'Connexion',
              style: 'primary'
            }
          }
        ],
      }
    ],
    footerText: {
      text: 'Vous n’avez pas de compte ?',
      link: 'Inscrivez-vous',
      href: '/register',
    },
    passwordForgotten: {
      text: 'Mot de passe oublié ?',
      href: '/password-forgotten',
    }
  };
  const fields = loginForm.forms[0].fields;
  const formValues = reactive({
    email: '',
    password: '',
  });
  const alert: IAlert = reactive({
    display: false,
    message: '',
  });

  provide('formContainer', loginForm);

  function updateValue(inputName: string, value: string) {
    if(inputName === 'email') {
      formValues.email = value;
    } else {
      formValues.password = value;
    }
  }

  async function login() {
    const submitButton = fields[2];
    submitButton.loading = 'Chargement...';

    const result = await fetch(`${env.VITE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formValues.email,
        password: formValues.password,
      }),
    });
    const resultJson = await result.json();

    if (result.ok) {
      // TODO: redirect to dashboard and store token
    } else {
      let errorsFields: any;
      let globalError: any;

      if(resultJson.errors) {
        errorsFields = resultJson.errors;
      } else {
        globalError = resultJson.message;
      }

      if(errorsFields) {
        errorsFields.forEach((error: any) => {
          fields.forEach((field: any) => {
            if (field.attributes.name === error.field) {
              field.error = error.message;
            }
          });
        });
      } else {
        alert.display = true;
        alert.type = 'error';
        alert.message = globalError;

        setTimeout(() => {
          alert.display = false;
        }, 3000);
      }
    }
  }
</script>

<template>
  <main class="login">
    <FormPage
        :image="image"
        @sendValue="updateValue"
        @submit="login"
    />
    <Alert
      :display="alert.display"
      :type="alert.type"
      :message="alert.message"
    />
  </main>
</template>