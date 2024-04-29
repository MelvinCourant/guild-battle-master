<script setup>
import "../../assets/css/components/utils/_dialog.scss";
import Field from "./Field.vue";
import Avatar from "./Avatar.vue";
import Select from "./inputs/Select.vue";

defineProps({
  dialog: {
    type: Object,
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
});
defineEmits(["close", "click", "change"]);
</script>

<template>
  <dialog
    v-if="isOpen"
    open
    class="dialog"
    aria-labelledby="dialog_title"
    aria-describedby="dialog_description"
  >
    <div class="dialog__content">
      <div class="dialog__image" v-if="dialog.image">
        <Avatar :src="dialog.image.src" :alt="dialog.image.alt" />
      </div>
      <h2 id="dialog_title" class="dialog__title">
        {{ dialog.content.title }}
      </h2>
      <p id="dialog_description" class="dialog__description">
        {{ dialog.content.description }}
      </p>
      <Select
        v-if="dialog.content.select"
        :label="dialog.content.select.label"
        :options="dialog.content.select.options"
        :value="dialog.content.select.value"
        @change="$emit('change', $event)"
      />
    </div>
    <div class="dialog__fields">
      <Field
        v-for="field in dialog.fields"
        :attributes="field"
        :key="field.name"
        @click="$emit('click', $event)"
      />
    </div>
  </dialog>
  <div v-if="isOpen" class="dialog__overlay" @click="$emit('close')"></div>
</template>
