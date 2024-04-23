<script setup>
import '../../../assets/css/components/utils/inputs/_combobox.scss';
import { ref } from 'vue';
import Badge from "../Badge.vue";

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  resetValues: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['updateValues']);

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

function updateValues(value) {
  if(!values.value.find((v) => v.value === value)) {
    values.value.push(props.options.find((option) => option.value === value));
  } else {
    values.value = values.value.filter((v) => v.value !== value);
  }

  emit('updateValues', values.value);
  document.querySelectorAll('.combobox__input').forEach((input) => {
    input.value = '';
  });
  props.options.forEach((option) => {
    option.display = true;
  });
}

function search(value) {
  props.options.forEach((option) => {
    option.display = option.text.toLowerCase().includes(value.toLowerCase());
  });
}
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
          autocomplete="off"
          @input="search($event.target.value)"
          @focus="isOpen = true"
        >
        <div class="combobox__arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="6" viewBox="0 0 9 6" fill="none">
            <path d="M0.666672 0.916668L4.83334 5.08333L9 0.916668H0.666672Z" fill="var(--white)"/>
          </svg>
        </div>
        <ul
          v-if="values.length > 0"
          class="combobox__values"
        >
          <Badge
            v-for="value in values"
            :key="value.value"
            :monstersIds="[value.value]"
            :name="value.text"
            :element="value.element"
            :canBeDeleted="true"
            @deleteBadge="updateValues(value.value)"
          />
        </ul>
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
                'combobox__option--selected': values.find((v) => v.value === option.value)
              }
          ]"
          v-show="option.display"
          @click="isOpen = false; updateValues(option.value)"
        >
          {{ option.text }}
        </li>
      </ul>
    </div>
  </div>
</template>