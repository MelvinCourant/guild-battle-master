<script setup lang="ts">
import '../../assets/css/components/utils/_tooltip.scss'
import { ref } from 'vue'

const props = defineProps( {
  imgs: {
    type: Array,
    required: true
  }
});

const columnsLimit = 4;
const tooltipImagesGrid = ref('')

if(props.imgs.length > columnsLimit) {
  tooltipImagesGrid.value = `display: grid; grid-template-columns: repeat(${columnsLimit}, 1fr);`
}
</script>

<template>
  <div class="tooltip">
    <div
        class="tooltip__images"
        :style="tooltipImagesGrid"
    >
      <img
          v-for="img in imgs"
          :src="img.src"
          :alt="img.alt"
          width="30"
          height="30"
          class="tooltip__image"
      />
    </div>
  </div>
</template>