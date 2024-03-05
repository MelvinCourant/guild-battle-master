<script setup>
  import Form from "@components/utils/Form.vue";

  defineProps({
    image: {
      type: String,
      default: "",
    },
    form: {
      type: Object,
      required: true,
    }
  })
</script>
<template>
  <div class="form-page">
    <Form :form="form"/>
  </div>
</template>