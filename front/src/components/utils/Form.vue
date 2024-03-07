<script setup lang="ts">
  import "@css/components/utils/form.scss";
  import Field from "@components/utils/Field.vue";
  import type { PropType } from "vue";
  import type { IForm } from "@models/form.ts";

  defineProps({
    form: {
      type: Object as PropType<IForm>,
      required: true,
    }
  })
</script>

<template>
  <div class="form-container">
    <form class="form">
      <h2
          class="form__title"
          v-if="form.title"
      >
        {{ form.title }}
      </h2>
      <div class="form__fields">
        <div class="form__fields__inputs">
          <Field
              v-for="field in form.fields.splice(0, form.fields.length - 1)"
              :key="field.label"
              :label="field.label"
              :style="field.style"
              :error="field.error"
              :image="field.image"
              :input="field.input"
          />
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
              v-if="form.footerText"
          >
            {{ form.footerText.text }}
            <a
                :href="form.footerText.href"
            >
              {{ form.footerText.link }}
            </a>
          </p>
        </div>
      </div>
    </form>
    <router-link
        v-if="form.passwordForgotten"
        :to="form.passwordForgotten.href"
        class="password-forgotten"
    >
      {{ form.passwordForgotten.text }}
    </router-link>
  </div>
</template>