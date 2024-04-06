<script setup lang="ts">
  import InputString from "../../components/utils/inputs/InputString.vue";
  import InputFile from "../../components/utils/inputs/InputFile.vue";
  import Button from "../../components/utils/inputs/Button.vue";
  import type { IAttributes, IImage } from "../../models/form.ts";
  import type { PropType } from "vue";

  defineProps({
    error: {
      type: String,
    },
    image: {
      type: Object as PropType<IImage>,
    },
    label: {
      type: String,
      default: "",
    },
    loading: {
      type: String,
      default: "",
    },
    attributes: {
      type: Object as PropType<IAttributes>,
      required: true,
    }
  });

  defineEmits(['click', 'sendValue']);
</script>

<template>
  <InputFile
    :image="image"
    :label="label"
    :attributes="attributes"
    v-if="attributes.type === 'file'"
    @sendValue="(inputName: string, value: string) => $emit('sendValue', inputName, value)"
  />

  <InputString
    :label="label"
    :error="error"
    :attributes="attributes"
    v-if="
      attributes.type === 'text' ||
      attributes.type === 'email' ||
      attributes.type === 'password' ||
      attributes.type === 'search'
    "
    @sendValue="(inputName: string, value: string) => $emit('sendValue', inputName, value)"
  />

  <Button
    :loading="loading"
    :attributes="attributes"
    v-if="
      attributes.type === 'button' ||
      attributes.type === 'submit'
    "
    @click="$emit('click', $event)"
  />
</template>