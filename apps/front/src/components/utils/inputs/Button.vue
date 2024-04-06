<script setup lang="ts">
  import '../../../assets/css/components/utils/inputs/_button.scss';
  import { IAttributes } from "../../../models/form.ts";
  import { PropType } from "vue";

  defineProps({
    loading: {
      type: String as PropType<string>,
      default: '',
    },
    attributes: {
      type: Object as PropType<IAttributes>,
      required: true,
    },
  });

  defineEmits(['click']);
</script>

<template>
  <input
    :type="attributes.type"
    :value="loading || attributes.value"
    class="button"
    :class="attributes.style"
    :disabled="attributes.disabled"
    @click="$emit('click', attributes.name)"
    v-if="attributes.type === 'button'"
  />
  <input
    :type="attributes.type"
    :value="loading || attributes.value"
    class="button"
    @click="$emit('click', attributes.name)"
    :class="attributes.style"
    :disabled="attributes.disabled"
    v-else
  />
</template>