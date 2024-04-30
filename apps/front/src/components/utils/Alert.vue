<script setup>
import '../../assets/css/components/utils/_alert.scss';

defineProps({
  display: {
    type: Boolean,
    required: true,
    default: false,
  },
  type: {
    type: String,
    default: 'success',
  },
  message: {
    type: String,
    required: true,
  },
});

defineEmits(['close']);
</script>

<template>
  <div
      class="alert"
      v-show="display"
      :class="`alert--${type}`"
  >
    <div class="alert__icon">
      <svg
          v-if="type === 'success'"
          xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
        <path d="M50 0C22.4 0 0 22.4 0 50C0 77.6 22.4 100 50 100C77.6 100 100 77.6 100 50C100 22.4 77.6 0 50 0ZM50 90C27.95 90 10 72.05 10 50C10 27.95 27.95 10 50 10C72.05 10 90 27.95 90 50C90 72.05 72.05 90 50 90ZM72.95 27.9L40 60.85L27.05 47.95L20 55L40 75L80 35L72.95 27.9Z" fill="var(--success)"/>
      </svg>

      <svg
          v-else
          xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
        <path d="M50 0C22.35 0 0 22.35 0 50C0 77.65 22.35 100 50 100C77.65 100 100 77.65 100 50C100 22.35 77.65 0 50 0ZM50 90C27.95 90 10 72.05 10 50C10 27.95 27.95 10 50 10C72.05 10 90 27.95 90 50C90 72.05 72.05 90 50 90ZM67.95 25L50 42.95L32.05 25L25 32.05L42.95 50L25 67.95L32.05 75L50 57.05L67.95 75L75 67.95L57.05 50L75 32.05L67.95 25Z" fill="var(--danger)"/>
      </svg>
    </div>
    <p class="alert__message">
      {{ message }}
    </p>
  </div>
  <div
      class="alert__overlay"
      v-show="display"
      @click="$emit('close')"
  ></div>
</template>