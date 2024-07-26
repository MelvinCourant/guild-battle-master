<script setup>
import "../assets/css/components/_actual-composition.scss";
import Select from "./utils/inputs/Select.vue";
import { provide, reactive, ref, watch } from "vue";
import Field from "./utils/Field.vue";
import Compositions from "./utils/Compositions.vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  compositions: {
    type: Array,
    required: true,
  },
  compositionName: {
    type: String,
    default: "",
  },
  optionValue: {
    type: String,
    default: "5",
  },
  mode: {
    type: String,
    default: "composition",
  },
  grade: {
    type: String,
    default: "",
  },
});

const emits = defineEmits([
  "clickOnDefense",
  "updateCompositionGrade",
  "updateCompositionName",
  "saveComposition",
  "cancel",
]);

const { t } = useI18n();
const actualCompositions = ref(props.compositions);

provide("compositions", actualCompositions);

watch(
  () => props.compositions,
  (newCompositions) => {
    actualCompositions.value = newCompositions;
  },
);

const options = [
  {
    text: t("tower_nat", { number: 5 }),
    value: "5",
  },
  {
    text: t("tower_nat", { number: 4 }),
    value: "4",
  },
];
const optionValue = ref(props.optionValue);
const nameField = reactive({
  type: "text",
  name: "name",
  placeholder: t("composition_name"),
  value: props.compositionName,
  autocomplete: "off",
});
const buttons = [
  {
    type: "button",
    name: "cancel",
    value: t("cancel"),
  },
  {
    type: "submit",
    name: "save",
    value: t("save"),
    style: "primary",
  },
];

if (props.mode === "tower") {
  nameField.disabled = true;
}

watch(
  () => props.compositionName,
  (newName) => {
    nameField.value = newName;
  },
);

function defenseHover(event) {
  const defenseRemove = document.createElement("div");

  defenseRemove.classList.add("defense__remove");
  defenseRemove.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 30 31" fill="none">\n' +
    '  <path d="M15 0.5C6.72 0.5 0 7.22 0 15.5C0 23.78 6.72 30.5 15 30.5C23.28 30.5 30 23.78 30 15.5C30 7.22 23.28 0.5 15 0.5ZM22.5 17H7.5V14H22.5V17Z" fill="#F85149"/>\n' +
    "</svg>";
  event.appendChild(defenseRemove);
  document.body.style.cursor = "pointer";
}

function defenseLeave(event) {
  if (event.querySelector(".defense__remove")) {
    event.querySelector(".defense__remove").remove();
    document.body.style.cursor = "default";
  }
}

function actionButton(name) {
  if (name === "cancel") {
    emits("cancel");
  }
}

function updateCompositionGrade(value) {
  optionValue.value = value;
  emits("updateCompositionGrade", value);
}
</script>

<template>
  <form class="actual-composition" @submit.prevent="$emit('saveComposition')">
    <div class="actual-composition__form">
      <Select
        v-if="mode !== 'tower'"
        :options="options"
        :value="optionValue"
        @change="updateCompositionGrade"
      />
      <p v-if="mode === 'tower'" class="actual-composition__grade">
        {{ grade }}
      </p>
      <Field
        :attributes="nameField"
        @sendValue="
          (name, value) => $emit('updateCompositionName', name, value)
        "
      />
    </div>
    <div class="actual-composition__defenses">
      <Compositions
        @defenseHover="defenseHover"
        @defenseLeave="defenseLeave"
        @clickOnDefense="
          (index, defense, defenseId) =>
            $emit('clickOnDefense', index, defense, defenseId)
        "
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
