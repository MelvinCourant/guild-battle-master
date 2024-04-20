<script setup>
import '../../../assets/css/components/utils/inputs/_select.scss';
import {ref} from 'vue';

defineProps({
  label: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

defineEmits(['change']);

const isOpen = ref(false);

document.addEventListener('click', (event) => {
  if (
      !(event.target).closest('.select') &&
      isOpen.value
  ) {
    isOpen.value = false;
  }
});
</script>

<template>
  <div class="select">
    <label
        for="select"
        class="select__label"
        v-if="label"
    >
      {{ label }}
    </label>
    <button
        role="combobox"
        :class="[
            'select__button',
            {
              'select__button--open': isOpen
            }
        ]"
        id="select"
        value="Select"
        aria-controls="listbox"
        aria-haspopup="listbox"
        tabindex="0"
        aria-expanded="false"
        @click="isOpen = !isOpen"
    >
      {{ options.find(option => option.value === value).text }}
      <svg xmlns="http://www.w3.org/2000/svg" width="9" height="6" viewBox="0 0 9 6" fill="none">
        <path d="M0.666672 0.916668L4.83334 5.08333L9 0.916668H0.666672Z" fill="var(--white)"/>
      </svg>
    </button>
    <ul
        role="listbox"
        :class="[
            'select__list',
            {
              'select__list--open': isOpen
            }
        ]"
        id="listbox"
    >
      <li
          v-for="(option, index) in options"
          :key="option.value"
          role="option"
          :tabindex="index"
          :class="[
              'select__option',
              {
                'select__option--selected': option.value === value
              }
          ]"
          @click="isOpen = false; $emit('change', option.value)"
      >
        {{ option.text }}
      </li>
    </ul>
    <div
        class="select__trigger"
        @click="isOpen = false"
        v-show="isOpen"
    ></div>
  </div>
</template>