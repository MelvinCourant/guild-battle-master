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

  function debounce(func, delay) {
    let debounceTimer;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    }
  }

  const updateValue = debounce(async () => {
    emit("sendValue", props.attributes.name, props.attributes.value);
  }, 300);
</script>

<template>
  <div
      class="input-string"
      :class="[typeClass, labelClass, {error: error}]"
  >
    <label
        class="input-string__label"
        :for="props.attributes.name"
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
      :id="props.attributes.name"
      :name="props.attributes.name"
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