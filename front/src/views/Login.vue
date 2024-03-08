<script setup lang="ts">
  import '@css/views/login-register.scss';
  import FormPage from "@components/FormPage.vue";
  import { IImage, IForm } from "@models/form.ts";
  import { provide } from "vue";

  function generateImgSrc(src: string) {
    return new URL(`../assets/imgs/${src}`, import.meta.url).href;
  }

  const image: IImage = {
    src: generateImgSrc("camilla.jpg"),
    alt: 'Login image',
  }
  const loginForm: IForm = {
    title: 'Guild battle Master',
    forms: [
      {
        id: 1,
        fields: [
          {
            label: 'Pseudo/email',
            input: {
              type: 'text',
            }
          },
          {
            label: 'Mot de passe',
            input: {
              type: 'password',
            }
          },
          {
            input: {
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