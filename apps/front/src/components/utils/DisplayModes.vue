<script setup lang="ts">
import '../../assets/css/components/utils/_display-modes.scss';
import {inject, reactive} from "vue";

const modes = reactive(inject('displayModes'));

function updateModes(modeSelected) {
  modes.forEach((mode) => {
    if(mode.name === modeSelected) {
      mode.isSelected = true;
    } else {
      mode.isSelected = false;
    }
  });
}
</script>

<template>
  <div
      class="display-modes"
      v-if="modes"
  >
    <button
        v-for="mode in modes"
        :key="mode.name"
        :class="[
            'display-modes__mode',
            {'display-modes__mode--selected': mode.isSelected}
        ]"
        @click="updateModes(mode.name)"
    >
      <svg
          v-if="mode.name === 'list'"
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="12"
          viewBox="0 0 15 12"
          fill="none"
      >
        <path fill-rule="evenodd" clip-rule="evenodd" d="M15 8.57143H11.5714V12H15V8.57143ZM11.5714 4.28571H15L15 7.71429H11.5714V4.28571ZM11.5714 0H15V3.42857H11.5714L11.5714 0ZM0.428572 4.28571L10.7143 4.28571V7.71429L0.428572 7.71429L0.428572 4.28571ZM10.7143 0L0.428572 0V3.42857L10.7143 3.42857L10.7143 0ZM10.7143 8.57143V12L0.428572 12V8.57143L10.7143 8.57143Z" fill="var(--text-grey)"/>
      </svg>
      <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
      >
        <path d="M12 12V6.66667L6.66667 6.66667L6.66667 12H12ZM8 8L10.6667 8V10.6667H8V8ZM12 5.33333L12 0H6.66667L6.66667 5.33333L12 5.33333ZM8 1.33333H10.6667L10.6667 4H8L8 1.33333ZM5.33333 12L5.33333 6.66667L0 6.66667V12L5.33333 12ZM1.33333 8H4L4 10.6667L1.33333 10.6667V8ZM5.33333 5.33333L5.33333 0L0 0L0 5.33333L5.33333 5.33333ZM1.33333 1.33333H4V4H1.33333V1.33333Z" fill="var(--text-grey)"/>
      </svg>
    </button>
  </div>
</template>