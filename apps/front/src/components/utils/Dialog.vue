<script setup lang="ts">
import '../../assets/css/components/utils/_dialog.scss';
import Field from "./Field.vue";

defineProps({
  dialog: {
    type: Object,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: false
  }
});
defineEmits(['close', 'click']);
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
      <div
          class="dialog__image"
          v-if="dialog.image.src"
      >
        <img
            :src="dialog.image.src"
            :alt="dialog.image.alt"
        />
      </div>
      <h2 id="dialog_title" class="dialog__title">
        {{ dialog.content.title }}
      </h2>
      <p id="dialog_description" class="dialog__description">
        {{ dialog.content.description }}
      </p>
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
  <div
      v-if="isOpen"
      class="dialog__overlay"
      @click="$emit('close')"
  ></div>
</template>