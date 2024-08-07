<script setup>
import "../../../assets/css/components/utils/inputs/_input-file.scss";
import { ref, nextTick } from "vue";
import { SkeletonLoader } from "vue3-loading-skeleton";
import { useI18n } from "vue-i18n";

const props = defineProps({
  image: {
    type: Object,
  },
  label: {
    type: String,
  },
  attributes: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["sendValue", "imageLoaded"]);

const { t } = useI18n();
const type = ref("");
const typeClass = ref("");
const onDragOver = ref(false);
const files = ref(null);
const imageLoaded = ref(false);

if (props.attributes.accept.match(/image/)) {
  type.value = "image";
  typeClass.value = `input-file--image`;
} else {
  type.value = "file";
  typeClass.value = `input-file--file`;
}

const image = ref(props.image);
const fileName = ref("");

function triggerInputFile() {
  const input = document.querySelector(
    `input[name="${props.attributes.name}"]`,
  );
  input.click();
}

function dropFile(event) {
  event.preventDefault();

  files.value = event.dataTransfer.files;
  changeFile(event, true);

  onDragOver.value = false;
}

async function changeFile(event, drop = false) {
  await nextTick();

  const input = event.target;
  let file;

  if (drop) {
    file = files.value[0];
  } else {
    file = input.files[0];
  }

  if (type.value === "image") {
    fileName.value = file.name;

    if (file) {
      const reader = new FileReader();

      reader.addEventListener("load", function (e) {
        const readerTarget = e.target;
        let srcTarget = "";

        if (readerTarget) {
          srcTarget = readerTarget.result;
        }

        image.value = {
          src: srcTarget,
          alt: fileName,
        };
      });

      reader.readAsDataURL(file);
    }
  } else {
    fileName.value = file.name;
  }

  emit("sendValue", props.attributes.name, file);
}

function onImageLoad() {
  imageLoaded.value = true;
  emit("imageLoaded");
}
</script>

<template>
  <div class="input-file" :class="[typeClass, { dragging: onDragOver }]">
    <div class="input-file__drop" v-if="type === 'file'">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="41"
        viewBox="0 0 40 41"
        fill="none"
      >
        <path
          d="M35 28V35.5H5V28H0V35.5C0 38.25 2.25 40.5 5 40.5H35C37.75 40.5 40 38.25 40 35.5V28H35ZM7.5 13L11.025 16.525L17.5 10.075V30.5H22.5V10.075L28.975 16.525L32.5 13L20 0.5L7.5 13Z"
          fill="#737A8C"
        />
      </svg>
      <span v-if="fileName">
        {{ fileName }}
      </span>
      <span v-else>
        {{ t("drag_and_drop_file") }}
        <br />
        {{ t("or") }}
      </span>
    </div>

    <label
      class="input-file__label"
      :for="attributes.name"
      v-if="type === 'file' && label"
    >
      <input
        type="button"
        class="input-file__browse button"
        :class="attributes.style"
        :value="label"
        @click.prevent="triggerInputFile"
      />
      <input
        class="input-file__input"
        :id="attributes.name"
        :name="attributes.name"
        :type="attributes.type"
        :value="attributes.value"
        :accept="attributes.accept"
        @change="changeFile"
        @dragenter.prevent="onDragOver = true"
        @dragleave.prevent="onDragOver = false"
        @drop.prevent="dropFile"
      />
    </label>

    <label
      class="input-file__label"
      :for="attributes.name"
      v-if="type === 'image' && image"
    >
      <img
        :src="image.src"
        :alt="image.alt"
        @load="onImageLoad"
        v-show="imageLoaded"
      />
      <SkeletonLoader circle size="100" tag="div" v-if="!imageLoaded" />
      <input
        class="input-file__input"
        :id="attributes.name"
        :name="attributes.name"
        :type="attributes.type"
        :value="attributes.value"
        :accept="attributes.accept"
        @change="changeFile"
      />
    </label>
  </div>
</template>
