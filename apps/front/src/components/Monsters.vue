<script setup>
import FiltersBar from "./utils/FiltersBar.vue";
import MonstersGrid from "./grids/MonstersGrid.vue";

defineEmits(['sendValue']);
</script>

<template>
  <div class="monsters">
    <FiltersBar
        @sendValue="(inputName, value) => $emit('sendValue', inputName, value)"
    />
    <MonstersGrid/>
  </div>
</template>