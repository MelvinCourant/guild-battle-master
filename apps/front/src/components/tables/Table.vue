<script setup lang="ts">
import {inject, ref, watch} from "vue";
import Badge from "../utils/Badge.vue";

const columns = inject("columns");
const data = ref(inject("data"));
const rows = ref([]);
const badges = ref([]);

watch(data, () => {
  rows.value = data.value.rows;
  badges.value = data.value.badges;
});

</script>

<template>
  <table>
    <thead>
      <tr>
        <th
          v-for="column in columns"
          :key="column"
        >
          {{ column.name }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in rows" :key="index">
        <td v-for="(info, key) in row" :key="key">
          <ul v-if="badges.includes(key)" class="badges">
            <Badge v-for="monster in info" :key="monster.name" :name="monster.name" :element="monster.element"/>
          </ul>
          <span v-else>{{ info }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>