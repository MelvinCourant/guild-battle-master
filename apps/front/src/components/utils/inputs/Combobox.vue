<script setup>
import '../../../assets/css/components/utils/inputs/_combobox.scss';
import { ref } from 'vue';

defineProps({
  label: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    required: true
  }
});

const values = ref([]);
const isOpen = ref(false);

document.addEventListener('click', (event) => {
  if (
    !(event.target).closest('.combobox') &&
    isOpen.value
  ) {
    isOpen.value = false;
  }
});
</script>

<template>
  <div class="combobox">
    <div class="combobox__container">
      <label
        for="combobox"
        class="combobox__label"
      >
        {{ label }}
      </label>
      <div
        :class="[
            'combobox__entries',
            {
              'combobox__entries--open': isOpen
            }
        ]"
      >
        <input
          role="combobox"
          class="combobox__input"
          id="combobox"
          aria-controls="listbox"
          aria-haspopup="listbox"
          aria-expanded="false"
          @focus="isOpen = true"
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="6" viewBox="0 0 9 6" fill="none">
          <path d="M0.666672 0.916668L4.83334 5.08333L9 0.916668H0.666672Z" fill="var(--white)"/>
        </svg>
      </div>
      <ul
        role="listbox"
        :class="[
              'combobox__list',
              {
                'combobox__list--open': isOpen
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
                'combobox__option',
                {
                  'combobox__option--comboboxed': option.value === value
                }
            ]"
          @click="isOpen = false; $emit('change', option.value)"
        >
          {{ option.text }}
        </li>
      </ul>
    </div>
  </div>
</template>