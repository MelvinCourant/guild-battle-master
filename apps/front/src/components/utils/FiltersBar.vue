<script setup lang="ts">
import '../../assets/css/components/utils/_filters-bar.scss';
import Field from "./Field.vue";
import DisplayModes from "./DisplayModes.vue";
import {inject, reactive} from "vue";

const fields = inject('fields');
</script>

<template>
  <div class="filters-bar">
    <div class="filters-bar__fields">
      <Field
          v-for="field in fields"
          :key="field.name"
          :attributes="field"
      />
    </div>
    <DisplayModes/>
  </div>
</template>