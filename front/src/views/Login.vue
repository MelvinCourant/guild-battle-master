<script setup>
  import FormPage from "@components/FormPage.vue";

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
    <FormPage :form="loginForm" />
  </main>
</template>