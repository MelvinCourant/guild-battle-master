<script setup>
import '../assets/css/components/_monsters.scss'
import FiltersBar from "./utils/FiltersBar.vue";
import MonstersGrid from "./grids/MonstersGrid.vue";

defineEmits(['search']);
</script>

<template>
  <div class="monsters">
    <FiltersBar
        @search="(inputName, value) => $emit('search', inputName, value)"
    />
    <MonstersGrid/>
  </div>
</template>