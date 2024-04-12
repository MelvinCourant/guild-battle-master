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

defineEmits(['sendValue']);
</script>

<template>
  <div class="checkbox">
    <input
      :id="attributes.name"
      :name="attributes.name"
      :type="attributes.type"
      :checked="attributes.checked"
      @change="$emit('sendValue', attributes.name, $event.target.checked)"
    />
    <label :for="attributes.name">{{ label }}</label>
  </div>
</template>