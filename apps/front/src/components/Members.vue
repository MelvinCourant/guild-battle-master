<script setup lang="ts">
import '../assets/css/components/_members.scss';
import Table from "./tables/Table.vue";
import FiltersBar from "./utils/FiltersBar.vue";
import Grid from "./grids/Grid.vue";

defineProps({
  displayModes: {
    type: Array,
    required: true
  }
});

defineEmits(['sort', 'actionSelected', 'sendValue', 'modeSelected', 'sortGrid']);
</script>

<template>
  <div class="members">
    <FiltersBar
        @sendValue="(inputName: string, value: string) => $emit('sendValue', inputName, value)"
        @modeSelected="$emit('modeSelected', $event)"
    />
    <Table
        v-show="displayModes[0].isSelected"
        @sort="$emit('sort', $event)"
        @actionSelected="$emit('actionSelected', $event)"
    />
    <Grid
        v-show="displayModes[1].isSelected"
        @actionSelected="$emit('actionSelected', $event)"
        @sortGrid="$emit('sortGrid', $event)"
    />
  </div>
</template>