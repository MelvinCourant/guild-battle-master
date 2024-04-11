<script setup>
import '../../assets/css/components/grids/_monsters-grid.scss';
import {inject, nextTick, onMounted, ref} from "vue";
import Loader from "../utils/Loader.vue";
import MonsterCard from "../MonsterCard.vue";

const monsters = inject('monsters')
const loading = ref(inject('loading'))
const gridTemplateColumns  = ref(null)
const cardWidth = ref(100)
const styleGrid = ref('')

async function updateGrid() {
  await nextTick();
  const grid = document.querySelector('.monsters-grid')

  if(
      window.innerWidth < 768 &&
      cardWidth.value === 100
  ) {
    cardWidth.value = 80;
  } else if(
      window.innerWidth > 768 &&
      cardWidth.value === 80
  ) {
    cardWidth.value = 100;
  }

  gridTemplateColumns.value = Math.floor((grid.clientWidth / cardWidth.value))
  styleGrid.value = `grid-template-columns: repeat(${gridTemplateColumns.value}, 1fr);`
}

onMounted(() => {
  updateGrid()
})

window.addEventListener('resize', updateGrid)
</script>

<template>
  <div
      :class="[
          'monsters-grid',
          {
            'monsters-grid--loading': loading
          }
      ]"
  >
    <ul
        class="monsters-grid__list"
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