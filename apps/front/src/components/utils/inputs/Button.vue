<script setup>
  import '../../../assets/css/components/utils/inputs/_button.scss';

  defineProps({
    loading: {
      type: String,
      default: '',
    },
    attributes: {
      type: Object,
      required: true,
    },
  });

  defineEmits(['click']);
</script>

<template>
  <input
    :type="attributes.type"
    :value="loading || attributes.value"
    class="button"
    :class="attributes.style"
    :disabled="attributes.disabled"
    @click="$emit('click', attributes.name)"
    v-if="attributes.type === 'button'"
  />
  <input
    :type="attributes.type"
    :value="loading || attributes.value"
    class="button"
    @click="$emit('click')"
    :class="attributes.style"
    :disabled="attributes.disabled"
    v-else
  />
</template>