<script setup>
import '../../assets/css/components/grids/_monsters-grid.scss';
import {inject, nextTick, onMounted, ref} from "vue";
import Loader from "../utils/Loader.vue";
import MonsterCard from "../MonsterCard.vue";

const monsters = inject('monsters')
const loading = ref(inject('loading'))
const gridTemplateColumns  = ref(null)
const cardWidth = 100
const styleGrid = ref('')

async function updateGrid() {
  await nextTick();
  const grid = document.querySelector('.monsters-grid')

  gridTemplateColumns.value = Math.floor(grid.clientWidth / cardWidth)
  styleGrid.value = `grid-template-columns: repeat(${gridTemplateColumns.value}, 1fr);`
}

onMounted(() => {
  updateGrid()
})

window.addEventListener('resize', updateGrid)
</script>

<template>
  <div class="monsters-grid">
    <ul
        :class="[
          'monsters-grid__list',
          {
            'monsters-grid__list--loading': loading
          }
        ]"
        :style="styleGrid"
    >
      <MonsterCard
          v-for="(monster, index) in monsters"
          :key="index"
          :image="monster.image"
          :name="monster.name"
          :quantity="monster.quantity"
      />
    </ul>
    <Loader v-if="loading"/>
  </div>
</template>