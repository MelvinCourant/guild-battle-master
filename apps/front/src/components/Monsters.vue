<script setup>
import '../assets/css/components/_monsters.scss'
import FiltersBar from "./utils/FiltersBar.vue";
import MonstersGrid from "./grids/MonstersGrid.vue";
import SortGrid from "./grids/SortGrid.vue";

defineEmits(['search', 'sortGrid']);
</script>

<template>
  <div class="monsters">
    <FiltersBar
        @search="(inputName, value) => $emit('search', inputName, value)"
    />
    <SortGrid
        @sortGrid="$emit('sortGrid', $event)"
    />
    <MonstersGrid/>
  </div>
</template>