<script setup lang="ts">
import '../../assets/css/components/tables/_table-head.scss'
import {inject} from "vue";

const columns = inject("columns");

defineEmits(["sort"]);
</script>

<template>
  <thead class="table-head">
    <tr>
      <th
        v-for="column in columns"
        :key="column"
        :class="column.class"
        @click.stop="$emit('sort', column.key)"
      >
        {{ column.name }}
        <svg
          v-if="column.sortOrder"
          :style="{transform: column.sortOrder === 'asc' ? 'rotate(180deg)' : 'rotate(0)'}"
          class="table-head__sort-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="6"
          viewBox="0 0 12 6"
          fill="none"
        >
          <path d="M0 0L6 6L12 0H0Z" fill="white"/>
        </svg>
      </th>
    </tr>
  </thead>
</template>