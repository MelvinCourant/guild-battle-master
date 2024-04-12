<script setup>
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
</script>

<template>
  <div class="checkbox">
    <input
      :id="attributes.name"
      :name="attributes.name"
      :type="attributes.type"
      :checked="attributes.checked"
    />
    <label :for="attributes.name">{{ label }}</label>
  </div>
</template>