<script setup>
import '../../assets/css/components/_table-grid.scss';
import Table from "../tables/Table.vue";
import FiltersBar from "./FiltersBar.vue";
import Grid from "../grids/Grid.vue";
import {provide, reactive} from "vue";
import {usePreferencesStore} from "../../stores/preferences.js";

defineEmits(['sort', 'actionSelected', 'search', 'modeSelected', 'sortGrid']);

const preferencesStore = usePreferencesStore();
const preferences = preferencesStore.preferences;
const displayModes = reactive([
  {
    name: 'list',
    isSelected: true
  },
  {
    name: 'grid',
    isSelected: false
  }
]);

provide('displayModes', displayModes);

if(preferences.displayMode) {
  displayModes.forEach((displayMode) => {
    if(displayMode.name === preferences.displayMode) {
      displayMode.isSelected = true;
      preferencesStore.updatePreferences('displayMode', displayMode.name);
    } else {
      displayMode.isSelected = false;
    }
  });
}

function toggleModeSelectedMobile() {
  if(
      window.innerWidth <= 991 &&
      displayModes[0].isSelected
  ) {
    displayModes[0].isSelected = false;
    displayModes[1].isSelected = true;
  }
}

if(
    window.innerWidth <= 768 &&
    displayModes[0].isSelected
) {
  toggleModeSelectedMobile()
}

window.addEventListener('resize', toggleModeSelectedMobile);

function updateDisplayMode(mode) {
  displayModes.forEach((displayMode) => {
    if(displayMode.name === mode) {
      displayMode.isSelected = true;
      preferencesStore.updatePreferences('displayMode', displayMode.name);
    } else {
      displayMode.isSelected = false;
    }
  });
}
</script>

<template>
  <div class="table-grid">
    <FiltersBar
        @search="(inputName, value) => $emit('search', inputName, value)"
        @modeSelected="updateDisplayMode"
    />
    <Table
        v-show="displayModes.find((displayMode) => displayMode.isSelected).name === 'list'"
        @sort="$emit('sort', $event)"
        @actionSelected="$emit('actionSelected', $event)"
    />
    <Grid
        v-show="displayModes.find((displayMode) => displayMode.isSelected).name === 'grid'"
        @actionSelected="$emit('actionSelected', $event)"
        @sortGrid="$emit('sortGrid', $event)"
    />
  </div>
</template>