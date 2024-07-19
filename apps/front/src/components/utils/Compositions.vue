<script setup>
import "../../assets/css/components/utils/_compositions.scss";
import { inject, ref } from "vue";
import Defense from "./Defense.vue";

defineEmits(["defenseHover", "defenseLeave", "clickOnDefense"]);

const compositions = ref(inject("compositions"));
</script>

<template>
  <div class="compositions">
    <Defense
      v-for="composition in compositions"
      :key="composition.id"
      :member="composition.member"
      :leader="composition.leader"
      :second="composition.second"
      :third="composition.third"
      :isSelected="composition.isSelected"
      @defenseHover="$emit('defenseHover', $event)"
      @defenseLeave="$emit('defenseLeave', $event)"
      @clickOnDefense="
        (defense) => $emit('clickOnDefense', composition.id, defense)
      "
    />
  </div>
</template>
