<script setup>
import '../../assets/css/components/utils/_avatar.scss';
import { computed } from "vue";

const props = defineProps({
  className: {
    type: String,
    default: ''
  },
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
  loading: {
    type: String,
    default: 'lazy'
  }
});

const env = import.meta.env;

const generateSrc = computed(() => {
  if(props.src === 'placeholder.jpg') {
    return new URL('../../assets/imgs/placeholder.jpg', import.meta.url).href;
  } else {
    return `${env.VITE_URL}/uploads/${props.src}`;
  }
});
</script>

<template>
  <img
      :class="[
          'avatar',
          className
      ]"
      :src="generateSrc"
      :alt="alt"
      :loading="loading"
  >
</template>