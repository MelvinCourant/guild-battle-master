<script setup lang="ts">
import '../assets/css/components/_members.scss';
import Table from "./tables/Table.vue";
import FiltersBar from "./utils/FiltersBar.vue";

defineEmits(['sort', 'actionSelected', 'sendValue']);
</script>

<template>
  <div class="members">
    <FiltersBar
        @sendValue="(inputName: string, value: string) => $emit('sendValue', inputName, value)"
    />
    <Table
        @sort="$emit('sort', $event)"
        @actionSelected="$emit('actionSelected', $event)"
    />
  </div>
</template>