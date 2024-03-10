<script setup lang="ts">
  import "@css/views/login-register.scss";
  import FormPage from "@components/FormPage.vue";
  import {IStep, IFormContainer} from "@models/form.ts";
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

  const registerForm: IFormContainer = {
    forms: [
      {
        id: 1,
        fields: [
          {
            image: {
              src: generateImgSrc('placeholder.jpg'),
              alt: 'User icon',
            },
            attributes: {
              type: 'file',
              accept: 'image/png, image/jpeg, image/jpg, image/webp',
            }
          },
          {
            label: 'Email*',
            attributes: {
              type: 'email',
              required: true,
            }
          },
          {
            label: 'Pseudo*',
            attributes: {
              type: 'text',
              required: true,
            }
          },
          {
            label: "Mot de passe*",
            attributes: {
              type: 'password',
              required: true,
            }
          },
          {
            label: 'Confirmer le mot de passe*',
            attributes: {
              type: 'password',
              required: true,
            }
          },
          {
            attributes: {
              type: 'submit',
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
            label: 'Nom de la guilde*',
            attributes: {
              type: 'text',
              required: true,
            }
          },
          {
            label: 'Parcourir',
            attributes: {
              type: 'file',
              accept: 'application/JSON',
              style: 'primary',
            }
          },
          {
            attributes: {
              type: 'submit',
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