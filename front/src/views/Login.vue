<script setup lang="ts">
  import '@css/views/login-register.scss';
  import FormPage from "@components/FormPage.vue";
  import { IImage, IFormContainer } from "@models/form.ts";
  import { provide } from "vue";

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
            label: 'Pseudo/email*',
            attributes: {
              type: 'text',
              required: true,
            }
          },
          {
            label: 'Mot de passe*',
            attributes: {
              type: 'password',
              required: true,
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

  provide('formContainer', loginForm);
</script>

<template>
  <main class="login">
    <FormPage :image="image"/>
  </main>
</template>