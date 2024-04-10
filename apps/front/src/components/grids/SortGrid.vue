<script setup>
import '../../assets/css/components/grids/_sort-grid.scss';
import Select from "../utils/inputs/Select.vue";
import {inject, ref} from "vue";

defineEmits(['sortGrid']);

const options = inject('sortOptions');
const value = ref(inject('sortValue'));
</script>

<template>
  <div class="sort-grid">
    <Select
      label="Trier par"
      :options="options"
      :value="value"
      @change="$emit('sortGrid', $event)"
    />
  </div>
</template>