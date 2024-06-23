<script setup>
import "../../assets/css/components/utils/_preview.scss";
import More from "./More.vue";
import Compositions from "./Compositions.vue";

defineProps({
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  actions: {
    type: Array,
    default: [],
  },
  memberRole: {
    type: String,
    default: "",
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
  compositionId: {
    type: Number,
    required: true,
  },
  orientation: {
    type: String,
    default: "right",
  },
});

const emits = defineEmits(["actionSelected", "hidePreview"]);

window.addEventListener("click", (event) => {
  if (
    !event.target.closest(".composition-card") &&
    !event.target.closest(".preview")
  ) {
    emits("hidePreview");
  }
});
</script>

<template>
  <div
    :class="[
      'preview',
      { 'preview--open': isOpen },
      { 'preview--left': orientation === 'left' },
    ]"
  >
    <div class="preview__head">
      <button class="preview__hide" @click="$emit('hidePreview')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="15"
          viewBox="0 0 18 15"
          fill="none"
        >
          <path
            d="M1.7625 0L0 1.7625L5.725 7.5L0 13.2375L1.7625 15L9.2625 7.5L1.7625 0Z"
            fill="var(--text-grey)"
          />
          <path
            d="M9.99932 0L8.23682 1.7625L13.9618 7.5L8.23682 13.2375L9.99932 15L17.4993 7.5L9.99932 0Z"
            fill="var(--text-grey)"
          />
        </svg>
      </button>
      <More
        v-if="actions"
        :actions="actions"
        :memberRole="memberRole"
        @actionSelected="
          $emit('actionSelected', {
            action: $event,
            id: compositionId,
          })
        "
      />
    </div>
    <div class="preview__body">
      <div class="preview__content">
        <p v-if="category" class="preview__category">
          {{ category }}
        </p>
        <h2 v-if="title" class="preview__title">
          {{ title }}
        </h2>
      </div>
      <Compositions />
    </div>
  </div>
</template>
