<script setup lang="ts">
  import "@css/components/utils/inputs/input-file.scss";
  import { IImage, IAttributes } from "@models/form.js";
  import {PropType, ref} from "vue";

  const props = defineProps({
    image: {
      type: Object as PropType<IImage>,
    },
    attributes: {
      type: Object as PropType<IAttributes>,
      required: true,
    }
  });

  const typeClass = ref("");

  if(props.attributes.accept.match(/image/)) {
    typeClass.value = `input-file--image`;
  } else {
    typeClass.value = `input-file--file`;
  }

  const image = ref(props.image);

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
      class="input-file"
      :class="typeClass"
  >
    <div
        class="input-file__image"
        v-if="image"
    >
      <img
          :src="image.src"
          :alt="image.alt"
      />
    </div>
    <input
        class="input-file__input"
        :type="attributes.type"
        :value="attributes.value"
        :accept="attributes.accept"
        @change="loadImageInput"
    />
  </div>
</template>