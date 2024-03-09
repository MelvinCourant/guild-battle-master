<script setup lang="ts">
  import "@css/components/form-page.scss";
  import Form from "@components/utils/Form.vue";
  import Stepper from "@components/utils/Stepper.vue";
  import type { PropType } from "vue";
  import type { IStep, IImage } from "@models/form.ts";
  import { ref } from "vue";

  defineProps({
    steps: {
      type: Array as PropType<Array<IStep>>,
    },
    image: {
      type: Object as PropType<IImage>,
    }
  })

  const currentStep = ref(1);

  function incrementStep() {
    currentStep.value++;
  }
</script>
<template>
  <div class="form-page">
    <div class="form-page__image" v-if="image">
      <img :src="image.src" :alt="image.alt" />
    </div>
    <div
        class="form-page__form"
        :class="{'form-page__form--no-steps': !steps}"
    >
      <Stepper
          v-if="steps"
          :steps="steps"
          :currentStep="currentStep"
      />
      <Form
          :currentStep="currentStep"
          @nextStep="incrementStep"
      />
    </div>
  </div>
</template>