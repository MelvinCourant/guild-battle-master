<script setup lang="ts">
  import '@css/components/utils/field.scss';
  import { ref } from "vue";
  import type { IField } from "@models/form.ts";
  import Input from "@components/utils/Input.vue";

  const props: IField = defineProps({
    label: {
      type: String,
      default: "",
    },
    error: {
      type: String,
    },
    image: {
      type: Object,
    },
    input: {
      type: Object,
      required: true,
    }
  });
  const typeClass = ref(`field--${props.input.type}`);
  const noLabelClass = ref('');
</script>

<template>
  <div
    class="field"
    :class="[typeClass, noLabelClass, {error: error}]"
  >
    <label
      :for="input.type"
      class="field__label"
      v-if="label"
      v-show="!error"
    >
      {{ label }}
    </label>
    <p
      class="field__error-text"
      v-if="error"
    >
      {{ error }}
    </p>
    <div class="field__image">
      <img
          v-if="image"
          :src="image.src"
          :alt="image.alt"
      />
    </div>
    <Input
      :type="input.type"
      :placeholder="input.placeholder"
      :value="input.value"
      :checked="input.checked"
      :disabled="input.disabled"
      :required="input.required"
      :style="input.style"
    />
  </div>
</template>