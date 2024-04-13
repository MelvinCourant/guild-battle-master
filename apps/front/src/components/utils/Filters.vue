<script setup>
import '../../assets/css/components/utils/_filters.scss';
import {ref, inject} from 'vue';
import Field from "./Field.vue";

const emit = defineEmits(['search']);

const filters = inject('filters');
const filtersValues = ref(inject('filtersValues'));
const filtersValuesSearch = ref({});
const buttons = [
  {
    type: 'button',
    name: 'cancel',
    value: 'Annuler',
  },
  {
    type: 'submit',
    name: 'filter',
    value: 'Filtrer',
    style: 'primary'
  }
];
const filtersOpen = ref(false);

function updateFilter(name, value) {
  filtersValuesSearch.value = {
    ...filtersValuesSearch.value,
    [name]: value,
  };
}

function actionButton(name) {
  if(name === 'cancel') {
    filtersOpen.value = false;
    filtersValuesSearch.value = filtersValues.value;
  } else {
    emit('search', 'filters', filtersValuesSearch.value);
    filtersOpen.value = false;
  }
}
</script>

<template>
  <div
      :class="[
          'filters',
          {
              'filters--open': filtersOpen,
          },
      ]"
      v-if="filters"
  >
    <button
        class="filters__button"
        @click="filtersOpen = !filtersOpen"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.2212 1.5H9.7212L5.9637 6.225L2.2212 1.5ZM0.158703 1.2075C1.6737 3.15 4.4712 6.75 4.4712 6.75V11.25C4.4712 11.6625 4.8087 12 5.2212 12H6.7212C7.1337 12 7.4712 11.6625 7.4712 11.25V6.75C7.4712 6.75 10.2612 3.15 11.7762 1.2075C11.8622 1.09678 11.9153 0.964147 11.9296 0.824705C11.9438 0.685263 11.9187 0.544616 11.8569 0.418778C11.7952 0.292941 11.6993 0.18697 11.5803 0.112932C11.4613 0.0388949 11.3239 -0.000234027 11.1837 1.05303e-06H0.751203C0.128703 1.05303e-06 -0.223797 0.712501 0.158703 1.2075Z" fill="#737A8C"/>
      </svg>
    </button>
    <div
        class="filters__dialog"
        v-if="filtersOpen"
    >
      <p class="filters__title">Filtres</p>
      <form
          class="filters__categories"
          @submit.prevent
      >
        <div
            v-for="(filter, index) in filters"
            :key="index"
            class="filters__category"
        >
          <div
              class="filters__category-title"
              v-if="filter.title"
          >
            {{ filter.title }}
          </div>
          <div class="filters__fields">
            <Field
                v-for="(field, index) in filter.fields"
                :key="index"
                :label="field.label"
                :attributes="field.attributes"
                @sendValue="(inputName, value) => updateFilter(inputName, value)"
            />
          </div>
        </div>
        <div class="filters__actions">
          <Field
              v-for="(button, index) in buttons"
              :key="index"
              :attributes="button"
              @click="(name) => actionButton(name)"
          />
        </div>
      </form>
    </div>
    <div
        class="filters__overlay"
        v-show="filtersOpen"
        @click="filtersOpen = false"
    ></div>
  </div>
</template>