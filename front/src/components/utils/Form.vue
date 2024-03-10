<script setup lang="ts">
  import "@css/components/utils/form.scss";
  import Field from "@components/utils/Field.vue";
  import type { IFormContainer } from "@models/form.ts";
  import gsap from "gsap";
  import { inject, ref, onMounted, watch, nextTick } from "vue";

  const props = defineProps({
    currentStep: {
      type: Number,
      required: true,
    },
  });

  defineEmits(['previousStep', 'nextStep']);

  const formContainer = inject('formContainer') as IFormContainer;
  const forms: Array<Object> = formContainer.forms;
  const formsTransform: any = ref([]);
  const formStyle = ref<string>('');

  function initTranslations() {
    for(let i = 0; i < forms.length; i++) {
      let translate: string = '';
      let translateValue: string = '';
      let position: string = 'initial';

      if(i === 0) {
        translateValue = '0';
      } else {
        translateValue = `calc(100% * ${i})`;
        position = 'absolute';
      }

      translate = `translateX(${translateValue})`;

      formsTransform.value.push({
        transform: translate,
        position: position,
      });
    }
  }

  if(forms.length !== 1) {
    initTranslations();

    onMounted(() => {
      const fieldsActive = document.querySelectorAll('.form__fields[data-active="true"]');
      const height = fieldsActive[0].clientHeight;

      formStyle.value = `height: ${height}px`;
    });
  }

  function updateTranslations() {
    for(let formIndex = 0; formIndex < forms.length; formIndex++) {
      let translate: string = '';
      let translateValue: string = '';
      let position: string = 'initial';

      if(formIndex === props.currentStep - 1) {
        translateValue = '0';
      } else if(formIndex < props.currentStep - 1) {
        translateValue = `calc(-100% * ${formIndex + 1})`;
        position = 'absolute';
      } else {
        translateValue = `calc(100% * ${formIndex + 1})`;
        position = 'absolute';
      }

      translate = `translateX(${translateValue})`;

      formsTransform.value[formIndex] = {
        transform: translate,
        position: position,
      };
    }
  }

  async function updateStep() {
    await nextTick();

    const newFieldActive = document.querySelector(`.form__fields[data-active="true"]:nth-of-type(${props.currentStep})`);

    if(newFieldActive) {
      const height: string = `${newFieldActive.clientHeight}px`;

      updateTranslations();

      gsap.to('.form', {
        height: height,
        duration: 0.5,
      });
    }
  }

  watch(() => props.currentStep, () => updateStep());

  window.addEventListener('resize', () => {
    const fieldActive = document.querySelector(`.form__fields[data-active="true"]:nth-of-type(${props.currentStep})`);

    if(fieldActive) {
      const height = fieldActive.clientHeight;

      formStyle.value = `height: ${height}px`;
    }
  });
</script>

<template>
  <div class="form-container">
    <form
        class="form"
        :style="formStyle"
    >
      <h2
          class="form__title"
          v-if="formContainer.title"
      >
        {{ formContainer.title }}
      </h2>
      <div
          class="form__fields"
          v-for="(form, index) in forms"
          :key="index"
          :data-active="currentStep >= index + 1"
          :style="formsTransform[index]"
      >
        <svg
            class="form__fields__back"
            @click.stop="$emit('previousStep')"
            v-if="
              forms.length !== 1 &&
              index !== 0
            "
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M23.3333 10.7083H5.58542L13.7375 2.55625L11.6667 0.5L0 12.1667L11.6667 23.8333L13.7229 21.7771L5.58542 13.625H23.3333V10.7083Z" fill="white"/>
        </svg>
        <div class="form__fields__inputs">
          <template
              v-for="(field, index) in form.fields"
              :key="index"
          >
            <Field
                :label="field.label"
                :error="field.error"
                :image="field.image"
                :attributes="field.attributes"
                v-if="index !== form.fields.length - 1"
            />
          </template>
        </div>
        <div class="form__fields__footer">
          <Field
              :label="form.fields[form.fields.length - 1].label"
              :error="form.fields[form.fields.length - 1].error"
              :image="form.fields[form.fields.length - 1].image"
              :attributes="form.fields[form.fields.length - 1].attributes"
              @nextStep="$emit('nextStep')"
          />
          <p
              class="form__fields__footer__text"
              v-if="formContainer.footerText"
          >
            {{ formContainer.footerText.text }}
            <a
                :href="formContainer.footerText.href"
            >
              {{ formContainer.footerText.link }}
            </a>
          </p>
        </div>
      </div>
    </form>
    <router-link
        v-if="formContainer.passwordForgotten"
        :to="formContainer.passwordForgotten.href"
        class="password-forgotten"
    >
      {{ formContainer.passwordForgotten.text }}
    </router-link>
  </div>
</template>