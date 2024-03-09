<script setup lang="ts">
  import '@css/components/utils/inputs/button.scss';
  import { IAttributes } from "@models/form.ts";
  import { PropType } from "vue";

  defineProps({
    attributes: {
      type: Object as PropType<IAttributes>,
      required: true,
    },
  });
</script>

<template>
  <input
    :type="attributes.type"
    :value="attributes.value"
    class="button"
    :class="attributes.style"
    :disabled="attributes.disabled"
  />
</template>