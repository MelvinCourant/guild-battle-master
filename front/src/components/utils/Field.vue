<script setup lang="ts">
  import '@css/components/utils/field.scss';
  import { ref } from "vue";
  import type { IField } from "@models/form.ts";
  import Input from "@components/utils/Input.vue";

  const props: IField = defineProps({
    label: {
      type: String,
      default: "",
    },
    error: {
      type: String,
    },
    image: {
      type: Object,
    },
    input: {
      type: Object,
      required: true,
    }
  });
  const typeClass = ref(`field--${props.input.type}`);
  const imageClass = ref('');
  const image = ref(props.image);

  if(props.image) {
    imageClass.value = 'field--image';
  }

  function loadImageInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const fileName = input.files?.[0].name;

    if(file) {
      const reader = new FileReader();

      reader.addEventListener("load", function (e) {
        const readerTarget = e.target;

        image.value = {
          src: readerTarget?.result,
          alt: fileName,
        };
      });

      reader.readAsDataURL(file);
    }
  }
</script>

<template>
  <div
    class="field"
    :class="[typeClass, imageClass, {error: error}]"
  >
    <label
      :for="input.type"
      class="field__label"
      v-if="label"
      v-show="!error"
    >
      {{ label }}
    </label>
    <p
      class="field__error-text"
      v-if="error"
    >
      {{ error }}
    </p>
    <div class="field__image">
      <img
          v-if="image"
          :src="image.src"
          :alt="image.alt"
      />
    </div>
    <Input
      :type="input.type"
      :placeholder="input.placeholder"
      :value="input.value"
      :checked="input.checked"
      :disabled="input.disabled"
      :required="input.required"
      :accept="input.accept"
      :style="input.style"
      @imageChange="loadImageInput"
    />
  </div>
</template>