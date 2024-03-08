<script setup lang="ts">
  import "@css/components/form-page.scss";
  import Form from "@components/utils/Form.vue";
  import Stepper from "@components/utils/Stepper.vue";
  import type { PropType } from "vue";
  import type { IStep, IImage } from "@models/form.ts";

  defineProps({
    steps: {
      type: Array as PropType<Array<IStep>>,
    },
    image: {
      type: Object as PropType<IImage>,
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
          v-if="steps"
          :steps="steps"
      />
      <Form/>
    </div>
  </div>
</template>