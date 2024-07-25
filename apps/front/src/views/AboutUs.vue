<script setup>
import "../assets/css/views/_about-us.scss";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const avatars = [
  {
    fileName: "nai",
    alt: "Melvin Courant/Naï~",
  },
];

function generateSrc(fileName) {
  return new URL(`../assets/imgs/avatars/${fileName}.jpg`, import.meta.url)
    .href;
}
</script>

<template>
  <main class="about-us">
    <div class="about-us__avatars">
      <div class="about-us__avatar" v-for="avatar in avatars">
        <img :src="generateSrc(avatar.fileName)" :alt="avatar.alt" />
      </div>
    </div>
    <div class="about-us__content">
      <h1 class="about-us__title">{{ t("about_us") }}</h1>
      <p class="about-us__infos">
        {{ t("founder_designer_developer") }}: <br />
        <a
          href="https://melvincourant.fr"
          :title="t('go_to_personal_website', { name: 'Melvin Courant' })"
          target="_blank"
          >Melvin Courant</a
        >
        aka <span>Naï~</span> {{ t("in_game") }} <br /><br />

        {{ t("support_email_address_problems_suggestions") }}: <br />
        <a href="mailto:support@guildbattlemaster.com" :title="t('send_email')"
          >support@guildbattlemaster.com</a
        >
      </p>
    </div>
  </main>
</template>
