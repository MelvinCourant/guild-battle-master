<script setup lang="ts">
  import InputString from "@components/utils/inputs/InputString.vue";
  import InputFile from "@components/utils/inputs/InputFile.vue";
  import Button from "@components/utils/inputs/Button.vue";

  defineProps({
    error: {
      type: String,
    },
    image: {
      type: Object,
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
      type: Object,
      required: true,
    }
  });

  defineEmits(['nextStep', 'sendValue']);
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
    @nextStep="$emit('nextStep')"
  />
</template>