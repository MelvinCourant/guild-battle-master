<script setup>
  import '@css/utils/field.scss';
  import { ref } from "vue";

  const props = defineProps({
    type: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
    },
    value: {
      type: String,
    },
    checked: {
      type: Boolean,
    },
    disabled: {
      type: Boolean
    },
    style: {
      type: String,
      default: "",
    },
    error: {
      type: String,
    },
  });
  const typeClass = ref(`field--${props.type}`);
  const noLabelClass = ref('');

  if(!props.label) {
    noLabelClass.value = `field--without-label`;
  }
</script>

<template>
  <div
    class="field"
    :class="[typeClass, noLabelClass, {error: error}]"
  >
    <label
      :for="type"
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
    <input
      :type="type"
      :placeholder="placeholder"
      :value="value"
      :checked="checked"
      :disabled="disabled"
      class="field__input"
      :class="style"
    />
  </div>
</template>