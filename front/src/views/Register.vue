<script setup lang="ts">
  import "@css/views/login-register.scss";
  import FormPage from "@components/FormPage.vue";
  import {IStep, IForm} from "@models/form.ts";
  import { provide } from "vue";

  function generateImgSrc(src: string) {
    return new URL(`../assets/imgs/${src}`, import.meta.url).href;
  }

  const steps: IStep[] = [
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
  ];

  const registerForm: IForm = {
    forms: [
      {
        id: 1,
        fields: [
          {
            image: {
              src: generateImgSrc('placeholder.jpg'),
              alt: 'User icon',
            },
            input: {
              type: 'file',
              accept: 'image/png, image/jpeg, image/jpg, image/webp',
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
      },
      {
        id: 2,
        fields: [
          {
            label: 'Nom de la guilde',
            input: {
              type: 'text',
            }
          },
          {
            input: {
              type: 'file',
              accept: 'application/JSON',
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
      }
    ],
    footerText: {
      text: 'Vous possédez déjà un compte ?',
      link: 'Connectez-vous',
      href: '/login',
    }
  };

  provide('formContainer', registerForm);
</script>

<template>
  <main class="register">
    <FormPage :steps="steps"/>
  </main>
</template>