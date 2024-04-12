<script setup>
import '../../assets/css/components/grids/_monsters-grid.scss';
import {inject, nextTick, onMounted, ref, watch} from "vue";
import Loader from "../utils/Loader.vue";
import MonsterCard from "../MonsterCard.vue";

const monsters = ref(inject('monsters'))
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
  if(monsters.value.length > 0) {
    updateGrid()
  }
})

watch(monsters, () => {
  updateGrid()
})

window.addEventListener('resize', () => {
  if(monsters.value.length > 0) {
    updateGrid()
  }
});
</script>

<template>
  <div
      :class="[
          'monsters-grid',
          {
            'monsters-grid--loading': loading
          },
          {
            'monsters-grid--empty': monsters.length === 0
          }
      ]"
  >
    <ul
        class="monsters-grid__list"
        :style="styleGrid"
        v-if="monsters.length > 0"
    >
      <MonsterCard
          v-for="(monster, index) in monsters"
          :key="index"
          :image="monster.image"
          :name="monster.name"
          :quantity="monster.quantity"
      />
    </ul>
    <p
        class="monsters-grid__empty"
        v-else-if="
          monsters.length === 0 &&
          !loading
        "
    >
      Aucun monstre disponible.
    </p>
    <Loader v-if="loading"/>
  </div>
</template>