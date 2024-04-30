<script setup>
import '../assets/css/views/_notifications-page.scss';
import { useUserStore } from "../stores/user.js";
import {ref} from "vue";
import Notification from "../components/menus/Notification.vue";
import { useRouter } from "vue-router";

const env = import.meta.env;
const userStore = useUserStore();
const token = userStore.token;
const router = useRouter();
const onMobile = ref(false);
const notifications = ref([]);
const actionsNotifications = [
  {
    name: "read",
    label: "Marquer comme lu",
    danger: false,
  },
  {
    name: "delete",
    label: "Supprimer",
    danger: true,
  }
];

function handleMobile() {
  if (
      window.innerWidth <= 768 &&
      !onMobile.value
  ) {
    onMobile.value = true;
  } else {
    onMobile.value = false;
    router.push('/guild');
  }
}

handleMobile();
window.addEventListener('resize', handleMobile);

async function getNotifications() {
  const result = await fetch(`${env.VITE_URL}/api/notifications`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if(result.ok) {
    const resultJson = await result.json();
    notifications.value = resultJson.notifications;

    if(resultJson.notifications[0].isRead) {
      document.querySelector('.navbar-mobile__link--unread').classList.remove('navbar-mobile__link--unread');
    }
  }
}

getNotifications();

async function bequeathLeader(value, notificationId) {
  const result = await fetch(`${env.VITE_URL}/api/users/bequeath-leader`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      "notification_id": notificationId,
      "accept": value
    })
  })

  if(result.ok) {
    await getNotifications();
  }
}

async function madeNotificationsAction(event) {
  if(event.action === 'bequeath_leader') {
    let actionValue;

    if(event.value === true) {
      actionValue = 1;
    } else {
      actionValue = 0;
    }

    await bequeathLeader(actionValue, event.notificationId);
  }
}

async function readNotification(notificationId) {
  const result = await fetch(`${env.VITE_URL}/api/notifications/${notificationId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if(result.ok) {
    await getNotifications();
  }
}

async function deleteNotification(notificationId) {
  const result = await fetch(`${env.VITE_URL}/api/notifications/${notificationId}`, {
    method: 'DELETE',
    headers : {
      'Authorization': `Bearer ${token}`
    }
  })

  if(result.ok) {
    await getNotifications();
  }
}

async function actionSelected(event) {
  if(event.action === 'read') {
    await readNotification(event.id);
  } else if(event.action === 'delete') {
    await deleteNotification(event.id);
  }
}
</script>

<template>
  <main class="notifications-page">
    <h1 class="notifications-page__title">Notifications</h1>
    <ul
        v-if="notifications.length > 0"
    >
      <Notification
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
        :actions="actionsNotifications"
        @actionSelected="actionSelected"
        @madeNotificationsAction="madeNotificationsAction"
        @notificationRead="readNotification"
      />
    </ul>
    <p v-else>
      Aucune notification disponible
    </p>
  </main>
</template>