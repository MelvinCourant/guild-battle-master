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
        <div class="form__fields__logs">
          <Field
              v-for="field in form.fields.splice(0, form.fields.length - 1)"
              :key="field.label"
              :type="field.type"
              :label="field.label"
              :placeholder="field.placeholder"
              :value="field.value"
              :checked="field.checked"
              :disabled="field.disabled"
              :style="field.style"
              :required="field.required"
          />
        </div>
        <div class="form__fields__footer">
          <Field
              :type="form.fields[form.fields.length - 1].type"
              :label="form.fields[form.fields.length - 1].label"
              :placeholder="form.fields[form.fields.length - 1].placeholder"
              :value="form.fields[form.fields.length - 1].value"
              :checked="form.fields[form.fields.length - 1].checked"
              :disabled="form.fields[form.fields.length - 1].disabled"
              :style="form.fields[form.fields.length - 1].style"
              :required="form.fields[form.fields.length - 1].required"
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
    <router-link :to="form.passwordForgotten.href" class="password-forgotten">
      {{ form.passwordForgotten.text }}
    </router-link>
  </div>
</template>