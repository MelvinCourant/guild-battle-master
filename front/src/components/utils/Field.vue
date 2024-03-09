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
    attributes: {
      type: Object,
      required: true,
    }
  });
</script>

<template>
  <InputFile
    :image="image"
    :attributes="attributes"
    v-if="attributes.type === 'file'"
  />

  <InputString
    :label="label"
    :attributes="attributes"
    v-if="
      attributes.type === 'text' ||
      attributes.type === 'email' ||
      attributes.type === 'password' ||
      attributes.type === 'search'
    "
  />

  <Button
    :attributes="attributes"
    v-if="
      attributes.type === 'button' ||
      attributes.type === 'submit'
    "
  />
</template>