<script setup lang="ts">
  import { IInput } from "@models/form.ts";

  const props: IInput = defineProps({
    type: {
     type: String,
     required: true,
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
    required: {
     type: Boolean,
    },
    accept: {
     type: String,
    },
    style: {
     type: String,
     default: "",
    },
  });
  const emits = defineEmits(['imageChange']);

  function sendValue(event: Event) {
    if(props.type === 'file') {
      emits('imageChange', event);
    } else {
      props.value = (event.target as HTMLInputElement).value;
    }
  }

</script>

<template>
  <input
      :type="type"
      :placeholder="placeholder"
      :value="value"
      :checked="checked"
      :disabled="disabled"
      :required="required"
      :accept="accept"
      class="field__input"
      :class="style"
      @change="sendValue"
  />
</template>