<script setup lang="ts">
  import "@css/components/utils/form.scss";
  import Field from "@components/utils/Field.vue";
  import type { IFormContainer } from "@models/form.ts";
  import { reactive, inject } from "vue";

  const formContainer = reactive(inject('formContainer') as IFormContainer);
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