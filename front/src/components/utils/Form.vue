<script setup>
  import Field from "@components/utils/Field.vue";

  defineProps({
    form: {
      type: Object,
      required: true,
    }
  })
</script>

<template>
  <form class="form">
    <h2 v-if="form.title">{{ form.title }}</h2>
    <Field
      v-for="field in form.fields"
      :key="field.label"
      :type="field.type"
      :label="field.label"
      :style="field.style"
    />
  </form>
</template>