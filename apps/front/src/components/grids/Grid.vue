<script setup lang="ts">
import '../../assets/css/components/grids/_grid.scss'
import {inject, ref, watch} from "vue";
import GridCard from "./GridCard.vue";
import Loader from "../utils/Loader.vue";

defineEmits(['actionSelected'])

const data = ref(inject('data'))
const columns = inject('columns')
const rows = ref([])
const loading = ref(inject('loading'))

watch(data, () => {
  rows.value = data.value.rows
})
</script>

<template>
  <div
      :class="[
          'grid',
          {
            'grid--loading': loading
          }
      ]"
  >
    <ul class="grid__list">
      <GridCard
          v-for="(row, index) in rows"
          :key="index"
          :badges="data.badges"
          :columns="columns"
          :content="row"
          :actions="data.actions"
          @actionSelected="$emit('actionSelected', $event)"
      />
    </ul>
    <Loader v-if="loading"/>
  </div>
</template>