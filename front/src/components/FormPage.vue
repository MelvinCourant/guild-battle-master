<script setup lang="ts">
  import "@css/components/form-page.scss";
  import Form from "@components/utils/Form.vue";
  import type { PropType } from "vue";
  import type { IImage, IForm } from "@models/form.ts";

  defineProps({
    image: {
      type: Object as PropType<IImage>,
    },
    form: {
      type: Object as PropType<IForm>,
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