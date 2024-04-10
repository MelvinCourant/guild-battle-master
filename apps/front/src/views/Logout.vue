<script setup>
  import { useUserStore } from "../stores/user";
  import { useRouter } from "vue-router";

  const userStore = useUserStore();
  const env = import.meta.env;
  const router = useRouter();

  async function logout() {
    const result = await fetch(`${env.VITE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userStore.token}`,
      },
    });

    if(result.ok) {
      userStore.logout();
      await router.push('/login');
    }
  }

  logout();
</script>

<template>
  <main>
    <h1>Déconnexion</h1>
  </main>
</template>