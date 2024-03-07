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
     style: {
       type: String,
       default: "",
     },
   });
</script>

<template>
  <input
      :type="type"
      :placeholder="placeholder"
      :value="value"
      :checked="checked"
      :disabled="disabled"
      :required="required"
      class="field__input"
      :class="style"
  />
</template>