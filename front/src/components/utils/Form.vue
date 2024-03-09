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

  defineEmits(['nextStep']);

  const formContainer = inject('formContainer') as IFormContainer;
  const forms: Array<Object> = formContainer.forms;
  const formsTransform = ref<Array<Object>>([]);
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

  async function nextStep() {
    await nextTick();

    const newFieldActive = document.querySelector('.form__fields[data-active="true"]:last-of-type');

    if(newFieldActive) {
      let heightValue: string = `${newFieldActive.clientHeight}px`;

      updateTranslations();

      gsap.to('.form', {
        height: heightValue,
        duration: 0.5,
      });
    }
  }

  watch(() => props.currentStep, () => nextStep());
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