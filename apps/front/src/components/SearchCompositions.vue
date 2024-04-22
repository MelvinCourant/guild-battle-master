<script setup>
import '../assets/css/components/_search-compositions.scss';
import FiltersBar from "./utils/FiltersBar.vue";
import Compositions from "./utils/Compositions.vue";
import Combobox from "./utils/inputs/Combobox.vue";
import {onMounted, provide, ref, watch} from "vue";

const props = defineProps({
  compositions: {
    type: Array,
    required: true
  },
  comboboxLabels: {
    type: Array,
    required: true
  },
  comboboxOptions: {
    type: Array,
    required: true
  }
});

defineEmits(['search', 'updateValues', 'clickOnDefense']);

const compositionsSearch = ref(props.compositions);

provide('compositions', compositionsSearch);

watch(() => props.compositions, (newCompositions) => {
  compositionsSearch.value = newCompositions;
});

function defenseHover(event) {
  const defenseAdd = document.createElement('div');

  defenseAdd.classList.add('defense__add');
  defenseAdd.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 30 31" fill="none">\n' +
      '  <path fill-rule="evenodd" clip-rule="evenodd" d="M0 15.5C0 7.22 6.72 0.5 15 0.5C23.28 0.5 30 7.22 30 15.5C30 23.78 23.28 30.5 15 30.5C6.72 30.5 0 23.78 0 15.5ZM16.5 17H22.5V14H16.5V8H13.5V14H7.5V17H13.5V23H16.5V17Z" fill="#DE7800"/>\n' +
      '</svg>';
  event.appendChild(defenseAdd);
  document.body.style.cursor = 'pointer';
}

function defenseLeave(event) {
  if(event.querySelector('.defense__add')) {
    event.querySelector('.defense__add').remove();
    document.body.style.cursor = 'default';
  }
}
</script>

<template>
  <div class="search-compositions">
    <FiltersBar
      @search="(inputName, value) => $emit('search', inputName, value)"
    />
    <div class="search-compositions__combobox">
      <Combobox
        v-for="(combobox, index) in comboboxLabels"
        :key="index"
        :label="combobox"
        :options="comboboxOptions"
        @updateValues="(values) => $emit('updateValues', comboboxLabels[index], values)"
      />
    </div>
    <Compositions
        @defenseHover="defenseHover"
        @defenseLeave="defenseLeave"
        @clickOnDefense="$emit('clickOnDefense', $event)"
    />
  </div>
</template>