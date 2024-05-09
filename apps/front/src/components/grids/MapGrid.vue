<script setup>
import "../../assets/css/components/grids/_map-grid.scss";
import MapCard from "../utils/MapCard.vue";

defineProps({
  cards: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="map-grid">
    <MapCard :cardDetails="card" v-for="card in cards" :key="card.id" />
  </div>
</template>
