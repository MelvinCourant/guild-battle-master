<script setup>
import '../../assets/css/components/utils/_more.scss';
import { ref } from 'vue';
import { useUserStore } from "../../stores/user.js";

const props = defineProps({
  actions: {
    type: Array,
    required: true
  },
  memberRole: {
    type: String,
    default: ''
  },
  orientation: {
    type: String,
    default: 'right'
  }
});

defineEmits(['actionSelected']);

const userStore = useUserStore();
const user = userStore.user;
const actionsToDisplay = ref([]);
const isOpened = ref(false);

function closeActions(event) {
  if (!event.target.closest('.more')) {
    isOpened.value = false;
  }
}

document.addEventListener('click', closeActions);

function getActions() {
  props.actions.forEach((action) => {
    action.permissions.forEach((permission) => {
      if (
          permission.role === user.role &&
          (
              permission.canModify.includes('all') ||
              permission.canModify.includes(props.memberRole)
          )
      ) {
        actionsToDisplay.value.push({
          name: action.name,
          label: action.label,
          danger: action.danger
        });
      }
    });
  });
}

getActions();
</script>

<template>
  <div
      class="more"
      v-if="actionsToDisplay.length > 0"
  >
    <button
      class="more__button"
      @click="isOpened = !isOpened"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="5" height="14" viewBox="0 0 5 14" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.49998 3.66659C3.41665 3.66659 4.16665 2.91659 4.16665 1.99992C4.16665 1.08325 3.41665 0.333252 2.49998 0.333252C1.58331 0.333252 0.833313 1.08325 0.833313 1.99992C0.833313 2.91659 1.58331 3.66659 2.49998 3.66659ZM2.49998 5.33325C1.58331 5.33325 0.833313 6.08325 0.833313 6.99992C0.833313 7.91658 1.58331 8.66658 2.49998 8.66658C3.41665 8.66658 4.16665 7.91658 4.16665 6.99992C4.16665 6.08325 3.41665 5.33325 2.49998 5.33325ZM0.833313 11.9999C0.833313 11.0833 1.58331 10.3333 2.49998 10.3333C3.41665 10.3333 4.16665 11.0833 4.16665 11.9999C4.16665 12.9166 3.41665 13.6666 2.49998 13.6666C1.58331 13.6666 0.833313 12.9166 0.833313 11.9999Z" fill="var(--white)"/>
      </svg>
    </button>
    <ul
      v-show="isOpened"
      :class="['more__actions', `more__actions--${orientation}`]"
    >
      <li
          v-for="action in actionsToDisplay"
          :key="action.id"
          class="more__item"
      >
        <button
          :class="['more__action', { 'more__action--danger': action.danger }]"
          @click.stop="$emit('actionSelected', action.name); isOpened = false"
        >
          {{ action.label }}
        </button>
      </li>
    </ul>
  </div>
</template>