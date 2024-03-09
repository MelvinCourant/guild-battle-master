<script setup lang="ts">
  import "@css/components/utils/stepper.scss";
  import type { ISteps } from "@models/form.ts";
  import type { PropType } from "vue";

  defineProps({
    steps: {
      type: Object as PropType<ISteps>,
      required: true,
    },
    currentStep: {
      type: Number,
      required: true,
    },
  })
</script>

<template>
  <ul class="stepper">
    <li
      v-for="(step, index) in steps"
      :key="index"
      class="stepper__step"
      :data-active="currentStep >= step.level"
    >
      <div
          class="stepper__step__line"
          v-if="index !== 0"
      >
      </div>
      <div class="stepper__step__circle">
        <div class="stepper__step__circle__number">
          <p>
            {{step.level}}
          </p>
        </div>
        <p class="stepper__step__circle__label">{{step.label}}</p>
      </div>
    </li>
  </ul>
</template>