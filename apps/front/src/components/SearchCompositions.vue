<script setup>
import '../assets/css/components/_search-compositions.scss';
import FiltersBar from "./utils/FiltersBar.vue";
import Compositions from "./utils/Compositions.vue";

defineEmits(['search']);
</script>

<template>
  <div class="search-compositions">
    <FiltersBar
      @search="(inputName, value) => $emit('search', inputName, value)"
    />
    <Compositions/>
  </div>
</template>