<script setup>
import '../../assets/css/components/menus/_notification.scss';
import Avatar from "../utils/Avatar.vue";
import {onMounted, ref, watch} from "vue";
import More from "../utils/More.vue";

const props = defineProps({
  notification: {
    type: Object,
    required: true
  },
  actions: {
    type: Array,
    default: []
  }
})

const emits = defineEmits(['action', 'actionSelected', 'notificationRead'])

function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + "an";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + "m";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + "j";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + "h";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + "min";
  }
  return Math.floor(seconds) + "s";
}

function formatMessage(message) {
  const words = message.split(' ');
  let formattedMessage = '';

  words.forEach((word, index) => {
    if (index === 0) {
      formattedMessage += `<span class="notification__pseudo">${word}</span> `;
    } else if (
        word.toLowerCase() === 'leader' ||
        word.toLowerCase() === 'moderator' ||
        word.toLowerCase() === 'member'
    ){
      formattedMessage += `<span class="notification__highlight">${word}</span> `;
    } else {
      formattedMessage += word + ' ';
    }
  });

  return formattedMessage.trim();
}

const time = ref(timeSince(new Date(props.notification.createdAt)));
const message = ref(formatMessage(props.notification.message));

function addMessage() {
  const messageElements = document.querySelectorAll(`[data-id="notification-${props.notification.id}"] .notification__message`);

  messageElements.forEach((element) => {
    element.innerHTML = message.value;
  })
}

onMounted(() => {
  addMessage();
})

watch(() => props.notification.createdAt, (value) => {
  time.value = timeSince(new Date(value));
})

watch(() => props.notification.message, (value) => {
  message.value = formatMessage(value);
  addMessage();
})

function emitNotificationRead(event) {
  if(!event.target.closest('.more')) {
    emits('notificationRead', props.notification.id);
  }
}
</script>

<template>
  <li
      :class="[
        'notification',
        {
          'notification--unread': notification.isRead === 0
        }
      ]"
      :data-id="`notification-${notification.id}`"
      @click="emitNotificationRead"
  >
    <Avatar
        :src="notification.image"
        alt="Sender avatar"
    />
    <div class="notification__content">
      <div class="notification__texts">
        <p class="notification__message"></p>
        <p class="notification__time">{{ time }}</p>
      </div>
      <div
          v-if="notification.action"
          class="notification__action"
      >
        <button
            class="notification__button"
            @click="$emit('action', {
              action: notification.action,
              value: true,
              notificationId: notification.id
            })"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 6.25C0 2.8 2.8 0 6.25 0C9.7 0 12.5 2.8 12.5 6.25C12.5 9.7 9.7 12.5 6.25 12.5C2.8 12.5 0 9.7 0 6.25ZM1.875 6.25L5 9.375L10.625 3.75L9.74375 2.8625L5 7.60625L2.75625 5.36875L1.875 6.25Z" fill="var(--success)"/>
          </svg>
        </button>
        <button
            class="notification__button"
            @click="$emit('action', {
              action: notification.action,
              value: false,
              notificationId: notification.id
            })"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.5 6.25C0.5 2.79375 3.29375 0 6.75 0C10.2063 0 13 2.79375 13 6.25C13 9.70625 10.2063 12.5 6.75 12.5C3.29375 12.5 0.5 9.70625 0.5 6.25ZM8.99375 9.375L9.875 8.49375L7.63125 6.25L9.875 4.00625L8.99375 3.125L6.75 5.36875L4.50625 3.125L3.625 4.00625L5.86875 6.25L3.625 8.49375L4.50625 9.375L6.75 7.13125L8.99375 9.375Z" fill="var(--danger)"/>
          </svg>
        </button>
      </div>
      <More
        v-else
        :actions="actions"
        @actionSelected="$emit('actionSelected', {
          action: $event,
          id: notification.id
        })"
      />
    </div>
  </li>
</template>