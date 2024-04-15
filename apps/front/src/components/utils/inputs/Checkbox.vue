<script setup>
import '../../../assets/css/components/utils/inputs/_checkbox.scss';
defineProps({
  label: {
    type: String,
    default: "",
  },
  attributes: {
    type: Object,
    required: true,
  }
});

defineEmits(['sendValue']);
</script>

<template>
  <label class="checkbox" :for="attributes.name">
    <input
        :id="attributes.name"
        :name="attributes.name"
        :type="attributes.type"
        :checked="attributes.checked"
        :disabled="attributes.disabled"
        class="checkbox__input"
        @change="$emit('sendValue', attributes.name, $event.target.checked)"
    />
    <span class="checkbox__checkmark">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="12" viewBox="0 0 14 12" fill="none">
        <path d="M4.59625 8.90625L1.46875 5.77875L0.403748 6.83625L4.59625 11.0288L13.5962 2.02875L12.5387 0.971252L4.59625 8.90625Z" fill="var(--white)"/>
      </svg>
    </span>
    <span class="checkbox__label">
      {{ label }}
    </span>
  </label>
</template>