<script setup lang="ts">
  import "@css/views/login-register.scss";
  import FormPage from "@components/FormPage.vue";
  import { IForm } from "@models/form.ts";

  function generateImgSrc(src: string) {
    return new URL(`../assets/imgs/${src}`, import.meta.url).href;
  }

  const registerForm: IForm = {
    steps: [
      {
        level: 1,
        label: 'Compte',
        active: true,
      },
      {
        level: 2,
        label: 'Guilde',
        active: false,
      },
      {
        level: 3,
        label: 'Résumé',
        active: false,
      },
    ],
    fields: [
      {
        image: {
          src: generateImgSrc('placeholder.jpg'),
          alt: 'User icon',
        },
        input: {
          type: 'file'
        }
      },
      {
        label: 'Email',
        input: {
          type: 'email',
        }
      },
      {
        label: 'Pseudo',
        input: {
          type: 'text',
        }
      },
      {
        label: "Mot de passe",
        input: {
          type: 'password',
        }
      },
      {
        label: 'Confirmer le mot de passe',
        input: {
          type: 'password',
        }
      },
      {
        input: {
          type: 'button',
          value: 'Continuer',
          style: 'primary',
        }
      }
    ],
    footerText: {
      text: 'Vous possédez déjà un compte ?',
      link: 'Connectez-vous',
      href: '/login',
    }
  };
</script>

<template>
  <main class="register">
    <FormPage :form="registerForm" />
  </main>
</template>