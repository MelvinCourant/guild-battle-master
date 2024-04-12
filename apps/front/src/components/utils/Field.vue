<script setup>
  import InputString from "../../components/utils/inputs/InputString.vue";
  import InputFile from "../../components/utils/inputs/InputFile.vue";
  import Button from "../../components/utils/inputs/Button.vue";
  import Checkbox from "./inputs/Checkbox.vue";

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

  defineEmits(['click', 'sendValue']);
</script>

<template>
  <InputFile
    :image="image"
    :label="label"
    :attributes="attributes"
    v-if="attributes.type === 'file'"
    @sendValue="(inputName, value) => $emit('sendValue', inputName, value)"
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
    @sendValue="(inputName, value) => $emit('sendValue', inputName, value)"
  />

  <Button
    :loading="loading"
    :attributes="attributes"
    v-if="attributes.type === 'button'"
    @click="$emit('click', $event)"
  />

  <Button
      :loading="loading"
      :attributes="attributes"
      v-if="attributes.type === 'submit'"
      @click="$emit('click')"
  />

  <Checkbox
      :label="label"
      :attributes="attributes"
      v-if="attributes.type === 'checkbox'"
  />
</template>