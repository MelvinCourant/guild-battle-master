<script setup>
import '../../assets/css/components/utils/_filters-bar.scss';
import Field from "./Field.vue";
import DisplayModes from "./DisplayModes.vue";
import {inject} from "vue";
import Filters from "./Filters.vue";

defineEmits(['search', 'modeSelected']);

const fields = inject('fields');
</script>

<template>
  <div class="filters-bar">
    <div class="filters-bar__fields">
      <Field
          v-for="field in fields"
          :key="field.name"
          :label="field.label"
          :attributes="field"
          @sendValue="(inputName, value) => $emit('search', inputName, value)"
      />
    </div>
    <Filters
        @search="(inputName, value) => $emit('search', inputName, value)"
    />
    <DisplayModes @modeSelected="$emit('modeSelected', $event)"/>
  </div>
</template>