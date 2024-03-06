<script setup>
  import '@css/views/login.scss';
  import FormPage from "@components/FormPage.vue";

  function generateImgSrc(src) {
    return new URL(`../assets/imgs/${src}`, import.meta.url).href;
  }

  const image = {
    src: generateImgSrc("camilla.jpg"),
    alt: "Login image",
  }
  const loginForm = {
    title: "Guild battle Master",
    fields: [
      {
        type: "text",
        label: "Pseudo/email",
      },
      {
        type: "password",
        label: "Password",
      },
      {
        type: "submit",
        value: "Connexion",
        style: "primary"
      }
    ],
    footerText: {
      text: "Vous n’avez pas de compte ?",
      link: "Inscrivez-vous",
      href: "/register",
    }
  };
</script>

<template>
  <main class="login">
    <FormPage :image="image" :form="loginForm" />
  </main>
</template>