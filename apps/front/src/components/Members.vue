<script setup lang="ts">
import '../assets/css/components/_members.scss';
import Table from "./tables/Table.vue";

defineEmits(["sort"]);
</script>

<template>
  <div class="members">
    <Table @sort="$emit('sort', $event)"/>
  </div>
</template>