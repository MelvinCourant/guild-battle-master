<script setup>
import '../../assets/css/components/utils/_compositions.scss';
import {inject, ref} from "vue";
import Defense from "./Defense.vue";

defineEmits(['defenseHover', 'defenseLeave', 'clickOnDefense']);

const compositions = ref(inject('compositions'));
</script>

<template>
  <div class="compositions">
    <Defense
      v-for="(composition, index) in compositions"
      :key="index"
      :member="composition.member"
      :leader="composition.leader"
      :second="composition.second"
      :third="composition.third"
      @defenseHover="$emit('defenseHover', $event)"
      @defenseLeave="$emit('defenseLeave', $event)"
      @clickOnDefense="$emit('clickOnDefense', $event)"
    />
  </div>
</template>