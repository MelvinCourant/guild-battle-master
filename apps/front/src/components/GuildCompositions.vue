<script setup>
import '../assets/css/components/_guild-compositions.scss';
import FiltersBar from "./utils/FiltersBar.vue";
import CompositionCard from "./CompositionCard.vue";
import Loader from "./utils/Loader.vue";

defineProps({
  compositions: {
    type: Array,
    required: true
  },
  actions: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="guild-compositions">
    <FiltersBar
        @search="(inputName, value) => $emit('search', inputName, value)"
    />
    <div class="guild-compositions__cards">
      <CompositionCard
          v-for="(composition, index) in compositions"
          :key="index"
          :composition="composition"
          :actions="actions"
      />
      <p
          class="guild-compositions__empty"
          v-if="
          compositions.length === 0 &&
          !loading
        "
      >
        Aucune composition disponible.
      </p>
      <Loader v-if="loading" />
    </div>
  </div>
</template>