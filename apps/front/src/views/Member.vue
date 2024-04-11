<script setup>
import '../assets/css/views/_member.scss';
import MemberProfile from "../components/MemberProfile.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../stores/user.js";

const env = import.meta.env;
const userStore = useUserStore();
const token = userStore.token;
const route = useRoute();
const params = route.params;
const memberId = parseInt(params.id);
const member = ref({});

async function getMember() {
  const result = await fetch(`${env.VITE_URL}/api/members/${memberId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  if (result.ok) {
    const resultJson = await result.json();
    member.value = resultJson.member;
  }
}

getMember();
</script>

<template>
  <main class="member">
    <MemberProfile
        :memberId="memberId"
        :pseudo="member.pseudo"
        :grade="member.grade"
        :image="member.image"
    />
  </main>
</template>