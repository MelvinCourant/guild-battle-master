<script setup lang="ts">
  import "@css/components/_form-page.scss";
  import Form from "@components/utils/Form.vue";
  import Stepper from "@components/utils/Stepper.vue";
  import type { PropType } from "vue";
  import type { IStep, IImage } from "@models/form.ts";

  defineProps({
    steps: {
      type: Array as PropType<Array<IStep>>,
    },
    currentStep: {
      type: Number,
      default: 1,
    },
    image: {
      type: Object as PropType<IImage>,
    }
  })
  defineEmits(["sendValue", "nextStep"]);
</script>
<template>
  <section class="form-page">
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
          @nextStep="$emit('nextStep')"
          @sendValue="(inputName: string, value: string) => $emit('sendValue', inputName, value)"
      />
    </div>
  </section>
</template>