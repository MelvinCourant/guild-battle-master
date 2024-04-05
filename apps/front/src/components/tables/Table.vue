<script setup lang="ts">
import '../../assets/css/components/tables/_table.scss'
import TableHead from "./TableHead.vue";
import TableRows from "./TableRows.vue";
</script>

<template>
  <table class="table">
    <TableHead />
    <TableRows />
  </table>
</template>