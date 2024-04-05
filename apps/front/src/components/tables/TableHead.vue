<script setup lang="ts">
import '../../assets/css/components/tables/_table-head.scss'
import {inject} from "vue";

const columns = inject("columns");
</script>

<template>
  <thead class="table-head">
    <tr>
      <th
        v-for="column in columns"
        :key="column"
        :class="column.class"
      >
        {{ column.name }}
      </th>
    </tr>
  </thead>
</template>