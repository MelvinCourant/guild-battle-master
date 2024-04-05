<script setup lang="ts">
import '../../assets/css/components/tables/_table.scss'
import TableHead from "./TableHead.vue";
import TableRows from "./TableRows.vue";

defineEmits(['sort', 'actionSelected']);
</script>

<template>
  <table class="table">
    <TableHead @sort="$emit('sort', $event)"/>
    <TableRows @actionSelected="$emit('actionSelected', $event)"/>
  </table>
</template>