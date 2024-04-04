<script setup lang="ts">
import { inject, ref } from "vue";

const columns = inject("columns");
const data = ref(inject("data"));

</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="column in columns" :key="column">{{ column.name }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in data" :key="index">
        <td v-for="(info, index) in row" :key="index">{{ info }}</td>
      </tr>
    </tbody>
  </table>
</template>