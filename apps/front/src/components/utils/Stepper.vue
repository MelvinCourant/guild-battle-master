<script setup>
  import "../../assets/css/components/utils/_stepper.scss";

  defineProps({
    steps: {
      type: Array,
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
          class="stepper__line"
          v-if="index !== 0"
      >
      </div>
      <div class="stepper__circle">
        <div class="stepper__number">
          <p>
            {{step.level}}
          </p>
        </div>
        <p class="stepper__label">{{step.label}}</p>
      </div>
    </li>
  </ul>
</template>