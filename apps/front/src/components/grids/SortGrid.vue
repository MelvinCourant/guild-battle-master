<script setup>
import Select from "../utils/inputs/Select.vue";
import { inject, ref } from "vue";
import { useI18n } from "vue-i18n";

defineEmits(["sortGrid"]);

const { t } = useI18n();
const options = inject("sortOptions");
const value = ref(inject("sortValue"));
</script>

<template>
  <div class="sort-grid">
    <Select
      :label="t('sort_by')"
      :options="options"
      :value="value"
      @change="$emit('sortGrid', $event)"
    />
  </div>
</template>
