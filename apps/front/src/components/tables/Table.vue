<script setup lang="ts">
import '../../assets/css/components/tables/_table.scss'
import TableHead from "./TableHead.vue";
import TableRows from "./TableRows.vue";
import Loader from "../utils/Loader.vue";
import {inject, ref, watch} from "vue";

defineEmits(['sort', 'actionSelected']);

const data = ref(inject('data'))
const rows = ref([])
const loading = ref(inject('loading'))

watch(data, () => {
  rows.value = data.value.rows
})
</script>

<template>
  <table
      :class="[
          'table',
          {
            'table--loading': loading
          }
      ]"
  >
    <TableHead @sort="$emit('sort', $event)"/>
    <TableRows @actionSelected="$emit('actionSelected', $event)"/>
    <Loader v-if="loading"/>
  </table>
</template>