<script setup lang="ts">
  import "@css/components/form-page.scss";
  import Form from "@components/utils/Form.vue";
  import Stepper from "@components/utils/Stepper.vue";
  import type { PropType } from "vue";
  import type { IImage, IForm } from "@models/form.ts";

  defineProps({
    steps: {
      type: Array as PropType<string[]>,
      required: true,
    },
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
    <div class="form-page__form">
      <Stepper
          v-if="form.steps"
          :steps="form.steps"
      />
      <Form :form="form"/>
    </div>
  </div>
</template>