<script setup lang="ts">
import '../../assets/css/components/grids/_grid.scss'
import {inject, nextTick, onMounted, ref, watch} from "vue";
import GridCard from "./GridCard.vue";
import Loader from "../utils/Loader.vue";
import SortGrid from "./SortGrid.vue";

defineEmits(['actionSelected', 'sortGrid'])

const data = ref(inject('data'))
const columns = inject('columns')
const rows = ref([])
const loading = ref(inject('loading'))
const displayModes = ref(inject('displayModes'))
const gridTemplateColumns: number | null = ref(null)
const cardWidth = 190
const styleGrid = ref('')

watch(data, () => {
  rows.value = data.value.rows
})

async function updateGrid() {
  const gridMode = displayModes.value.find(mode => mode.name === 'grid')

  if (
      gridMode.isSelected &&
      window.innerWidth > 768
  ) {
    await nextTick();
    const grid = document.querySelector('.grid')

    gridTemplateColumns.value = Math.floor(grid.clientWidth / cardWidth)
    styleGrid.value = `grid-template-columns: repeat(${gridTemplateColumns.value}, 1fr);`
  } else {
    styleGrid.value = ''
  }
}

watch(displayModes.value, () => {
  updateGrid()
});

onMounted(() => {
  updateGrid()
})

window.addEventListener('resize', updateGrid)
</script>

<template>
  <SortGrid
      @sortGrid="$emit('sortGrid', $event)"
  />
  <div
      :class="[
          'grid',
          {
            'grid--loading': loading
          }
      ]"
  >
    <ul
        class="grid__list"
        :style="styleGrid"
    >
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