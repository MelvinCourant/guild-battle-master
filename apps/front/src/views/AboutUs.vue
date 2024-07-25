<script setup>
import "../assets/css/views/_about-us.scss";

const avatars = [
  {
    src: "../assets/imgs/avatars/nai.jpg",
    alt: "Melvin Courant/Naï~",
  },
];

function generateSrc(src) {
  return new URL(src, import.meta.url).href;
}
</script>

<template>
  <main class="about-us">
    <div class="about-us__avatars">
      <div class="about-us__avatar" v-for="avatar in avatars">
        <img :src="generateSrc(avatar.src)" :alt="avatar.alt" />
      </div>
    </div>
    <div class="about-us__content">
      <h1 class="about-us__title">À propos</h1>
      <p class="about-us__infos">
        Fondateur, designer et développeur: <br />
        <a
          href="https://melvincourant.fr"
          title="Aller sur le site personnel de Melvin Courant"
          target="_blank"
          >Melvin Courant</a
        >
        aka <span>Naï~</span> ingame <br /><br />

        Adresse email de support pour tout problème ou suggestions: <br />
        <a href="mailto:support@guildbattlemaster.com" title="Envoyer un email"
          >support@guildbattlemaster.com</a
        >
      </p>
    </div>
  </main>
</template>
