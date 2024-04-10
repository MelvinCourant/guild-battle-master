<script setup>
import '../../assets/css/components/utils/_filters-bar.scss';
import Field from "./Field.vue";
import DisplayModes from "./DisplayModes.vue";
import {inject} from "vue";

defineEmits(['sendValue', 'modeSelected']);

const fields = inject('fields');
</script>

<template>
  <div class="filters-bar">
    <div class="filters-bar__fields">
      <Field
          v-for="field in fields"
          :key="field.name"
          :attributes="field"
          @sendValue="(inputName, value) => $emit('sendValue', inputName, value)"
      />
    </div>
    <DisplayModes
        @modeSelected="$emit('modeSelected', $event)"
    />
  </div>
</template>