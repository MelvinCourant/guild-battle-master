<script setup lang="ts">
  import "@css/components/utils/form.scss";
  import Field from "@components/utils/Field.vue";
  import type { IForm } from "@models/form.ts";
  import { reactive, inject } from "vue";

  const formContainer = reactive(inject('formContainer') as IForm);
  const forms = reactive(formContainer.forms);
</script>

<template>
  <div class="form-container">
    <form class="form">
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
      >
        <div class="form__fields__inputs">
          <template
            v-for="(field, index) in form.fields"
            :key="index"
          >
            <Field
              :label="field.label"
              :style="field.style"
              :error="field.error"
              :image="field.image"
              :input="field.input"
              v-if="index !== form.fields.length - 1"
            />
          </template>
        </div>
        <div class="form__fields__footer">
          <Field
              :label="form.fields[form.fields.length - 1].label"
              :style="form.fields[form.fields.length - 1].style"
              :error="form.fields[form.fields.length - 1].error"
              :image="form.fields[form.fields.length - 1].image"
              :input="form.fields[form.fields.length - 1].input"
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