<script setup>
import '../assets/css/components/_actual-composition.scss';
import Select from "./utils/inputs/Select.vue";
import { ref } from 'vue';
import Field from "./utils/Field.vue";
import Compositions from "./utils/Compositions.vue";

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
</script>

<template>
  <div class="actual-composition">
    <form
        class="actual-composition__form"
        @submit.prevent
    >
      <Select
          :options="options"
          :value="optionValue"
      />
      <Field :attributes="nameField" />
    </form>
    <div class="actual-composition__defenses">
      <Field :attributes="searchField"/>
      <Compositions />
    </div>
  </div>
</template>