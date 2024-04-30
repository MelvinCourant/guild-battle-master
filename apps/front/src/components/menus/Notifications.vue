<script setup>
import '../../assets/css/components/menus/_notifications.scss';
import Notification from "./Notification.vue";

defineProps({
  notifications: {
    type: Array,
    required: true
  },
  actions: {
    type: Array,
    default: []
  },
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emits = defineEmits(['close', 'action', 'actionSelected'])

document.addEventListener('click', (event) => {
  if (!event.target.closest('.notifications') && !event.target.closest('.navbar__notifications-button')) {
    emits('close')
  }
})
</script>

<template>
  <div
      class="notifications"
      v-show="isOpen"
  >
    <div class="notifications__head">
      <p>Notifications</p>
    </div>
    <div
        :class="[
          'notifications__body',
          {
            'notifications__body--empty': notifications.length === 0
          }
        ]"
    >
      <ul
          v-if="notifications.length > 0"
          class="notifications__list"
      >
        <Notification
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
          :actions="actions"
          @action="$emit('action', $event)"
          @actionSelected="$emit('actionSelected', $event)"
        />
      </ul>
      <p v-else>
        Aucune notification disponible
      </p>
    </div>
  </div>
</template>