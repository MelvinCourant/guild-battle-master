<script setup>
import '../assets/css/components/_search-compositions.scss';
import FiltersBar from "./utils/FiltersBar.vue";
import Compositions from "./utils/Compositions.vue";
import Combobox from "./utils/inputs/Combobox.vue";

defineProps({
  comboboxLabels: {
    type: Array,
    required: true
  },
  comboboxOptions: {
    type: Array,
    required: true
  }
});

defineEmits(['search']);
</script>

<template>
  <div class="search-compositions">
    <FiltersBar
      @search="(inputName, value) => $emit('search', inputName, value)"
    />
    <div class="search-compositions__combobox">
      <Combobox
        v-for="(combobox, index) in comboboxLabels"
        :key="index"
        :label="combobox"
        :options="comboboxOptions"
      />
    </div>
    <Compositions/>
  </div>
</template>