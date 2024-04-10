<script setup>
  import "../../../assets/css/components/utils/inputs/_input-string.scss";
  import { ref } from "vue";

  const props = defineProps({
    label: {
      type: String,
      default: "",
    },
    error: {
      type: String,
    },
    attributes: {
      type: Object,
      required: true,
    }
  })
  const emit = defineEmits(["sendValue"]);

  const typeClass = ref(`input-string--${props.attributes.type}`);
  const labelClass = ref('');

  if(props.label) {
    labelClass.value = 'input-string--label';
  }

  async function updateValue() {
    emit("sendValue", props.attributes.name, props.attributes.value);
  }
</script>

<template>
  <div
      class="input-string"
      :class="[typeClass, labelClass, {error: error}]"
  >
    <label
        class="input-string__label"
        v-if="label"
        v-show="!error"
    >
      {{ label }}
    </label>
    <p
        class="input-string__error-text"
        v-if="error"
    >
      {{ error }}
    </p>
    <input
      class="input-string__input"
      :type="props.attributes.type"
      :placeholder="props.attributes.placeholder"
      :value="props.attributes.value"
      :disabled="props.attributes.disabled"
      :required="props.attributes.required"
      :autocomplete="props.attributes.autocomplete"
      @input="updateValue"
      v-model="props.attributes.value"
    />
  </div>
</template>