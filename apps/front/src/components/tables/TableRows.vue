<script setup>
import "../../assets/css/components/tables/_table-rows.scss";

defineProps({
  rows: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <tbody class="table-rows">
    <tr v-for="(row, index) in rows" :key="index">
      <slot :row="row"></slot>
    </tr>
  </tbody>
</template>
