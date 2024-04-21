<script setup>
import '../assets/css/components/_actual-composition.scss';
import Select from "./utils/inputs/Select.vue";
import {provide, ref, watch} from 'vue';
import Field from "./utils/Field.vue";
import Compositions from "./utils/Compositions.vue";

const props = defineProps({
  compositions: {
    type: Array,
    required: true
  },
})

defineEmits(['clickOnDefense']);

const actualCompositions = ref(props.compositions);

provide('compositions', actualCompositions);

watch(() => props.compositions, (newCompositions) => {
  actualCompositions.value = newCompositions;
});

const options = [
  {
    text: 'Tour 5 nat',
    value: '5'
  },
  {
    text: 'Tour 4 nat',
    value: '4'
  }
]
const optionValue = ref('5')
const nameField = {
  type: 'text',
  name: 'name',
  placeholder: 'Nom de la composition',
}
const searchField = {
  type: 'search',
  name: 'search',
  placeholder: 'Membre, monstre .etc',
}
const searchValue = ref('')
const buttons = [
  {
    type: 'button',
    name: 'cancel',
    value: 'Annuler',
  },
  {
    type: 'submit',
    name: 'save',
    value: 'Sauvegarder',
    style: 'primary'
  }
];

function defenseHover(event) {
  const defenseRemove = document.createElement('div');

  defenseRemove.classList.add('defense__remove');
  defenseRemove.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 30 31" fill="none">\n' +
      '  <path d="M15 0.5C6.72 0.5 0 7.22 0 15.5C0 23.78 6.72 30.5 15 30.5C23.28 30.5 30 23.78 30 15.5C30 7.22 23.28 0.5 15 0.5ZM22.5 17H7.5V14H22.5V17Z" fill="#F85149"/>\n' +
      '</svg>';
  event.appendChild(defenseRemove);
  document.body.style.cursor = 'pointer';
}

function defenseLeave(event) {
  if(event.querySelector('.defense__remove')) {
    event.querySelector('.defense__remove').remove();
    document.body.style.cursor = 'default';
  }
}
</script>

<template>
  <form
      class="actual-composition"
      @submit.prevent
  >
    <div class="actual-composition__form">
      <Select
          :options="options"
          :value="optionValue"
      />
      <Field :attributes="nameField" />
    </div>
    <div class="actual-composition__defenses">
      <Field :attributes="searchField"/>
      <Compositions
          @defenseHover="defenseHover"
          @defenseLeave="defenseLeave"
          @clickOnDefense="(index, defense) => $emit('clickOnDefense', index, defense)"
      />
    </div>
    <div class="actual-composition__actions">
      <Field
          v-for="(button, index) in buttons"
          :key="index"
          :attributes="button"
          @click="(name) => actionButton(name)"
      />
    </div>
  </form>
</template>