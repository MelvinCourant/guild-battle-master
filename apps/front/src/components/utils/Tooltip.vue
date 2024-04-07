<script setup lang="ts">
import '../../assets/css/components/utils/_tooltip.scss'
defineProps( {
  img: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="tooltip">
    <img
      :src="img.src"
      :alt="img.alt"
      width="30"
      height="30"
      class="tooltip__image"
    />
  </div>
</template>