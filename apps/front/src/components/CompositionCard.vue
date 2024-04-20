<script setup>
import More from "./utils/More.vue";
import Defense from "./utils/Defense.vue";

defineProps({
  composition: {
    type: Object,
    required: true,
  },
  actions: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="composition-card">
    <div class="composition-card__header">
      <p class="composition-card__grade">Tour {{ composition.grade }} nat</p>
      <h3 class="composition-card__title">{{ composition.name }}</h3>
      <More
          :actions="actions"
      />
    </div>
    <div class="composition-card__defenses">
      <Defense
          v-for="defense in composition.defenses"
          :key="defense.id"
          :leader="defense.leader"
          :second="defense.second"
          :third="defense.third"
      />
    </div>
  </div>
</template>