<script setup>
import '../assets/css/components/_composition-card.scss';
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
      <div class="composition-card__actions-container">
        <div class="composition-card__actions">
          <More
            :actions="actions"
          />
        </div>
      </div>
      <p class="composition-card__grade">Tour {{ composition.grade }} nat</p>
      <h3 class="composition-card__title">{{ composition.name }}</h3>
    </div>
    <div class="composition-card__defenses">
      <Defense
          :leader="composition.defenses[0].leader"
          :second="composition.defenses[0].second"
          :third="composition.defenses[0].third"
      />
    </div>
  </div>
</template>