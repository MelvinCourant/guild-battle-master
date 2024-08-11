<script setup>
import "../../assets/css/components/tables/_table.scss";
import TableHead from "./TableHead.vue";
import Loader from "../utils/Loader.vue";
import { inject, ref } from "vue";

defineEmits(["sort", "actionSelected"]);

const loading = ref(inject("loading"));
</script>

<template>
  <table
    :class="[
      'table',
      {
        'table--loading': loading,
      },
    ]"
  >
    <TableHead @sort="$emit('sort', $event)" />
    <slot></slot>
    <Loader v-if="loading" />
  </table>
</template>
