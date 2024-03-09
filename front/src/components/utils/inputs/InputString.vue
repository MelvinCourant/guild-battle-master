<script setup lang="ts">
  import "@css/components/utils/inputs/input-string.scss";
  import { IAttributes } from "@models/form.ts";
  import { PropType, ref } from "vue";

  const props = defineProps({
    label: {
      type: String,
      default: "",
    },
    error: {
      type: String,
    },
    attributes: {
      type: Object as PropType<IAttributes>,
      required: true,
    }
  })

  const typeClass = ref(`input-string--${props.attributes.type}`);
</script>

<template>
  <div
      class="input-string"
      :class="[typeClass, {error: error}]"
  >
    <label
        class="input-string__label"
        v-if="label"
        v-show="!error"
    >
      {{ label }}
    </label>
    <p
        class="input-string__error-text"
        v-if="error"
    >
      {{ error }}
    </p>
    <input
      class="input-string__input"
      :type="props.attributes.type"
      :placeholder="props.attributes.placeholder"
      :value="props.attributes.value"
      :disabled="props.attributes.disabled"
      :required="props.attributes.required"
    />
  </div>
</template>