<script setup>
  import "@css/components/form-page.scss";
  import Form from "@components/utils/Form.vue";

  defineProps({
    image: {
      type: Object
    },
    form: {
      type: Object,
      required: true,
    }
  })
</script>
<template>
  <div class="form-page">
    <div class="form-page__image" v-if="image">
      <img :src="image.src" :alt="image.alt" />
    </div>
    <Form :form="form"/>
  </div>
</template>