<script setup>
  import "@css/utils/form.scss";
  import Field from "@components/utils/Field.vue";

  defineProps({
    form: {
      type: Object,
      required: true,
    }
  })
</script>

<template>
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
          :style="field.style"
        />
      </div>
      <div class="form__fields__footer">
        <Field
          :type="form.fields[form.fields.length - 1].type"
          :value="form.fields[form.fields.length - 1].value"
          :style="form.fields[form.fields.length - 1].style"
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
</template>