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
  memberRole: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['search', 'actionSelected', 'previewComposition'])
</script>

<template>
  <div class="guild-compositions">
    <FiltersBar
        @search="(inputName, value) => $emit('search', inputName, value)"
    />
    <div class="guild-compositions__cards">
      <CompositionCard
          v-for="composition in compositions"
          :key="composition.id"
          :composition="composition"
          :actions="actions"
          :memberRole="memberRole"
          @actionSelected="$emit('actionSelected', {
                action: $event,
                id: composition.id
          })"
          @previewComposition="$emit('previewComposition', composition.id)"
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