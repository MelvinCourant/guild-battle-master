<script setup lang="ts">
import '../../assets/css/components/utils/_badge.scss'

defineProps({
  name: {
    type: String,
    required: true
  },
  element: {
    type: String,
    required: true
  }
});
</script>

<template>
  <li
    :class="[
      'badge',
      `badge--${element}`
    ]"
  >
    <span class="badge__name">
      {{ name }}
    </span>
  </li>
</template>