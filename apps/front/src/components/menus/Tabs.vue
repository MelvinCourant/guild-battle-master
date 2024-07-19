<script setup>
import "../../assets/css/components/menus/_tabs.scss";

defineProps({
  links: {
    type: Array,
    required: true,
  },
  tools: {
    type: Array,
    required: true,
  },
});

defineEmits(["toolClicked"]);
</script>

<template>
  <div class="tabs">
    <nav class="tabs__nav">
      <ul class="tabs__list">
        <li v-for="link in links" :key="link.id" class="tabs__item">
          <router-link
            :to="link.path"
            :class="[
              'tabs__link',
              {
                'tabs__link--selected': link.selected,
              },
            ]"
          >
            {{ link.name }}
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="tabs__tools">
      <button
        v-for="tool in tools"
        :key="tool.name"
        class="tabs__tool"
        :title="tool.title"
        @click="$emit('toolClicked', tool)"
      >
        <svg
          v-if="tool.name === 'capture'"
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10.1053 3.15789V5.04632C10.1053 5.04632 8.84842 5.05263 8.8421 5.04632V3.15789H6.94737C6.94737 3.15789 6.95368 1.90105 6.94737 1.89474H8.8421V0H10.1053V1.89474H12V3.15789H10.1053ZM8.21053 5.68421V3.78947H6.31579V1.89474H1.26316C0.568421 1.89474 0 2.46316 0 3.15789V10.7368C0 11.4316 0.568421 12 1.26316 12H8.8421C9.53684 12 10.1053 11.4316 10.1053 10.7368V5.68421H8.21053ZM3.15789 8.21053L1.26316 10.7368H8.8421L6.31579 7.57895L4.42105 10.1053L3.15789 8.21053Z"
            fill="#737A8C"
          />
        </svg>
        <svg
          v-else-if="tool.name === 'reset'"
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="12"
          viewBox="0 0 11 12"
          fill="none"
        >
          <path
            d="M1.30222 6.83668C1.30222 5.76234 1.73847 4.78568 2.44818 4.07596L1.5236 3.15138C0.547903 4.12968 -1.52283e-05 5.45499 3.17436e-10 6.83668C3.17436e-10 9.49322 1.98589 11.681 4.55779 12V10.6848C2.71514 10.3722 1.30222 8.77048 1.30222 6.83668ZM10.4178 6.83668C10.4178 3.95876 8.08681 1.62778 5.2089 1.62778C5.16983 1.62778 5.13076 1.63429 5.0917 1.63429L5.80141 0.924579L4.88334 0L2.60445 2.27889L4.88334 4.55779L5.80141 3.63972L5.09821 2.93652C5.13728 2.93652 5.17634 2.93001 5.2089 2.93001C7.36408 2.93001 9.11557 4.6815 9.11557 6.83668C9.11557 8.77048 7.70266 10.3722 5.86001 10.6848V12C8.4319 11.681 10.4178 9.49322 10.4178 6.83668Z"
            fill="#737A8C"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
