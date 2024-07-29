<script setup>
import "../../assets/css/components/utils/_pager.scss";
import { ref, watch } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  lastPage: {
    type: Number,
    default: 1,
  },
});

const pagesButtons = ref([]);

function createPagesButtons() {
  let minPage;
  let maxPage;

  if (props.currentPage <= 3) {
    minPage = 1;
    maxPage = Math.min(5, props.lastPage);
  } else if (props.currentPage >= props.lastPage - 2) {
    minPage = Math.max(1, props.lastPage - 4);
    maxPage = props.lastPage;
  } else {
    minPage = props.currentPage - 2;
    maxPage = props.currentPage + 2;
  }

  for (let indexPage = minPage; indexPage <= maxPage; indexPage++) {
    if (indexPage <= props.lastPage) {
      pagesButtons.value.push({
        label: indexPage,
        selected: indexPage === props.currentPage,
      });
    }
  }
}

createPagesButtons();

watch(
  () => props.currentPage,
  () => {
    pagesButtons.value = [];
    createPagesButtons();
  },
);
</script>

<template>
  <ul class="pager">
    <li>
      <button class="pager__button" :disabled="props.currentPage === 1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="17"
          viewBox="0 0 21 17"
          fill="none"
        >
          <path
            d="M18.4192 17L20.4167 15.0025L13.9284 8.5L20.4167 1.9975L18.4192 0L9.91919 8.5L18.4192 17Z"
            fill="var(--white)"
          />
          <path
            d="M9.08337 17L11.0809 15.0025L4.59254 8.5L11.0809 1.9975L9.08337 0L0.583374 8.5L9.08337 17Z"
            fill="var(--white)"
          />
        </svg>
      </button>
    </li>
    <li>
      <button class="pager__button" :disabled="props.currentPage === 1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="17"
          viewBox="0 0 11 17"
          fill="none"
        >
          <path
            d="M10.7487 1.9975L8.75122 0L0.251221 8.5L8.75122 17L10.7487 15.0025L4.26039 8.5L10.7487 1.9975Z"
            fill="var(--white)"
          />
        </svg>
      </button>
    </li>
    <li v-for="page in pagesButtons" :key="page.label">
      <button
        class="pager__button"
        :class="{ 'pager__button--selected': page.selected }"
      >
        <span>{{ page.label }}</span>
      </button>
    </li>
    <li>
      <button
        class="pager__button"
        :disabled="props.currentPage === props.lastPage"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="17"
          viewBox="0 0 11 17"
          fill="none"
        >
          <path
            d="M2.24872 0L0.251221 1.9975L6.73955 8.5L0.251221 15.0025L2.24872 17L10.7487 8.5L2.24872 0Z"
            fill="var(--white)"
          />
        </svg>
      </button>
    </li>
    <li>
      <button
        class="pager__button"
        :disabled="props.currentPage === props.lastPage"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="17"
          viewBox="0 0 21 17"
          fill="none"
        >
          <path
            d="M2.58105 4.76837e-07L0.583555 1.9975L7.07189 8.5L0.583555 15.0025L2.58105 17L11.0811 8.5L2.58105 4.76837e-07Z"
            fill="var(--white)"
          />
          <path
            d="M11.9167 4.76837e-07L9.91925 1.9975L16.4076 8.5L9.91925 15.0025L11.9167 17L20.4167 8.5L11.9167 4.76837e-07Z"
            fill="var(--white)"
          />
        </svg>
      </button>
    </li>
  </ul>
</template>
