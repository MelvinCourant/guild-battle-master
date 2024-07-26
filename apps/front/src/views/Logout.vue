<script setup>
import { useUserStore } from "../stores/user";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStore();
const env = import.meta.env;
const router = useRouter();

async function logout() {
  const result = await fetch(`${env.VITE_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Accept-Language": userStore.language,
    },
  });

  if (result.ok) {
    userStore.logout();
    await router.push("/login");
  }
}

logout();
</script>

<template>
  <main>
    <h1>{{ t("logout") }}</h1>
  </main>
</template>
