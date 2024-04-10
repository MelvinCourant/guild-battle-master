<script setup>
  import "../assets/css/components/_form-page.scss";
  import Form from "../components/utils/Form.vue";
  import Stepper from "../components/utils/Stepper.vue";

  defineProps({
    steps: {
      type: Array,
    },
    currentStep: {
      type: Number,
      default: 1,
    },
    image: {
      type: Object,
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
          @sendValue="(inputName, value) => $emit('sendValue', inputName, value)"
      />
    </div>
  </section>
</template>