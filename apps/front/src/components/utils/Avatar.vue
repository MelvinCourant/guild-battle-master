<script setup>
import '../../assets/css/components/utils/_avatar.scss';
import {computed, ref} from "vue";
import {SkeletonLoader} from "vue3-loading-skeleton";

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
  disableSkeleton: {
    type: Boolean,
    default: false
  },
  loading: {
    type: String,
    default: 'lazy'
  }
});

const emit = defineEmits(['load']);

const env = import.meta.env;

const generateSrc = computed(() => {
  if(props.src === 'placeholder.jpg') {
    return new URL('../../assets/imgs/placeholder.jpg', import.meta.url).href;
  } else {
    return `${env.VITE_URL}/uploads/${props.src}`;
  }
});

const imageLoaded = ref(false);

function onImageLoad() {
  imageLoaded.value = true;
  emit('load');
}
</script>

<template>
  <img
      :class="[
          'avatar',
          className
      ]"
      :src="generateSrc"
      :alt="alt"
      v-show="imageLoaded"
      @load="onImageLoad"
      :loading="loading"
  >
  <SkeletonLoader
      size="100"
      tag="div"
      :class="[
          'avatar',
          className
      ]"
      v-if="!imageLoaded && !disableSkeleton"
  />
</template>