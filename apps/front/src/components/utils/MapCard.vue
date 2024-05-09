<script setup>
import "../../assets/css/components/utils/_map-card.scss";
import Defense from "./Defense.vue";

defineProps({
  cardDetails: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div
    :class="[
      'map-card',
      {
        'map-card--tower': cardDetails.position,
      },
    ]"
  >
    <div v-if="cardDetails.position" class="map-card__position">
      <span class="map-card__number">
        {{ cardDetails.position }}
      </span>
    </div>
    <Defense
      v-for="(defense, index) in cardDetails.defenses"
      :key="index"
      :member="defense.members"
      :leader="defense.leader"
      :second="defense.second"
      :third="defense.third"
    />
  </div>
</template>
