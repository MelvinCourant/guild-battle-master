<script setup>
import '../../assets/css/components/utils/_compositions.scss';
import {inject, ref} from "vue";
import Defense from "./Defense.vue";

const compositions = ref(inject('compositions'));
</script>

<template>
  <div class="compositions">
    <Defense
      v-for="composition in compositions"
      :key="composition.id"
      :member="composition.member.pseudo"
      :leader="composition.leader"
      :second="composition.second"
      :third="composition.third"
    />
  </div>
</template>