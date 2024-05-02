<script setup>
import '../assets/css/components/grids/_monster-card.scss';
import Avatar from "./utils/Avatar.vue";

defineProps({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  }
})
</script>

<template>
  <li class="monster-card">
    <Avatar
        :className="'monster-card__avatar'"
        :src="image"
        :alt="name"
        :disableSkeleton="true"
        :loading="'lazy'"
    />
    <div
        class="monster-card__quantity"
        v-if="quantity > 1"
    >
      <span class="monsters-card__number">
        {{ quantity }}
      </span>
    </div>
  </li>
</template>