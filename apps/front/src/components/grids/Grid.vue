<script setup>
import "../../assets/css/components/grids/_grid.scss";
import { inject, nextTick, onMounted, ref, watch } from "vue";
import Loader from "../utils/Loader.vue";
import SortGrid from "./SortGrid.vue";

defineEmits(["sortGrid"]);

const loading = ref(inject("loading"));
const displayModes = ref(inject("displayModes"));
const gridTemplateColumns = ref(null);
const cardWidth = 190;
const styleGrid = ref("");

async function updateGrid() {
  const gridMode = displayModes.value.find((mode) => mode.name === "grid");

  if (gridMode.isSelected && window.innerWidth > 768) {
    await nextTick();
    const grid = document.querySelector(".grid");

    gridTemplateColumns.value = Math.floor(grid.clientWidth / cardWidth);
    styleGrid.value = `grid-template-columns: repeat(${gridTemplateColumns.value}, 1fr);`;
  } else {
    styleGrid.value = "";
  }
}

watch(displayModes.value, () => {
  updateGrid();
});

onMounted(() => {
  updateGrid();
});

window.addEventListener("resize", updateGrid);
</script>

<template>
  <div class="grid-container">
    <SortGrid @sortGrid="$emit('sortGrid', $event)" />
    <div
      :class="[
        'grid',
        {
          'grid--loading': loading,
        },
      ]"
    >
      <ul class="grid__list" :style="styleGrid">
        <slot></slot>
      </ul>
      <Loader v-if="loading" />
    </div>
  </div>
</template>
