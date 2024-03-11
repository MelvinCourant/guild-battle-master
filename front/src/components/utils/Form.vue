<script setup lang="ts">
  import "@css/components/utils/form.scss";
  import Field from "@components/utils/Field.vue";
  import type { IFormContainer, IResume } from "@models/form.ts";
  import gsap from "gsap";
  import { inject, ref, onMounted, watch, nextTick } from "vue";

  const props = defineProps({
    currentStep: {
      type: Number,
      required: true,
    },
  });

  defineEmits(['nextStep', 'sendValue']);

  const formContainer = inject('formContainer') as IFormContainer;
  const forms: any = formContainer.forms;
  const formsTransform: any = ref([]);
  const resume: IResume = formContainer.resume;
  const formStyle = ref<string>('');
  let formLength: number;

  if(resume) {
    formLength = forms.length + 1;
  } else {
    formLength = forms.length;
  }

  function initTranslations() {
    for(let i = 0; i < formLength; i++) {
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
      const fieldsActive = document.querySelectorAll('.form [data-active="true"]');
      const height = fieldsActive[0].clientHeight;

      formStyle.value = `height: ${height}px`;
    });
  }

  function updateTranslations() {
    for(let formIndex = 0; formIndex < formLength; formIndex++) {
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

    const newFieldActive = document.querySelector(`.form [data-active="true"]:nth-child(${props.currentStep})`);

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
    const fieldActive = document.querySelector(`.form [data-active="true"]:nth-child(${props.currentStep})`);

    if(fieldActive) {
      const height = fieldActive.clientHeight;

      formStyle.value = `height: ${height}px`;
    }
  });
</script>

<template>
  <div class="form-container">
    <div
        class="form"
        :style="formStyle"
    >
      <h2
          class="form__title"
          v-if="formContainer.title"
      >
        {{ formContainer.title }}
      </h2>
      <form
          class="form__fields"
          v-for="(form, index) in forms"
          :key="index"
          :data-active="currentStep >= index + 1"
          :style="formsTransform[index]"
          @submit.prevent="$emit('nextStep')"
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
                @sendValue="(inputName: string, value: string) => $emit('sendValue', inputName, value)"
            />
          </template>
        </div>
        <div class="form__fields__footer">
          <Field
              :label="form.fields[form.fields.length - 1].label"
              :error="form.fields[form.fields.length - 1].error"
              :image="form.fields[form.fields.length - 1].image"
              :loading="form.fields[form.fields.length - 1].loading"
              :attributes="form.fields[form.fields.length - 1].attributes"
              @click="$emit('nextStep')"
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
      </form>
      <div
          class="form__resume"
          :style="formsTransform[resume.id - 1]"
          :data-active="currentStep >= resume.id"
          v-if="resume"
      >
        <div
            class="form__resume__content"
        >
          <template
              v-for="(line, index) in resume.content"
              :key="index"
          >
            <div
                class="line"
                :class="[
                    line.type === 'image' ? 'line--image' : '',
                    line.type === 'title' ? 'line--title' : '',
                    line.type === 'text' ? 'line--text' : '',
                ]"
            >
              <div
                  class="line__image"
                  v-if="line.image"
              >
                <img
                    :src="line.image.src"
                    :alt="line.image.alt"
                />
              </div>
              <p
                  class="line__text"
                  v-if="line.text"
              >
                {{ line.text }}
              </p>
            </div>
          </template>
        </div>
        <div class="form__resume__footer">
          <Field
              :loading="resume.submit.loading"
              :attributes="resume.submit.attributes"
              @click="$emit('nextStep')"
          />
        </div>
      </div>
    </div>
    <router-link
        v-if="formContainer.passwordForgotten"
        :to="formContainer.passwordForgotten.href"
        class="password-forgotten"
    >
      {{ formContainer.passwordForgotten.text }}
    </router-link>
  </div>
</template>