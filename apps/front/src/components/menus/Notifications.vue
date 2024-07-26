<script setup>
import "../../assets/css/components/menus/_notifications.scss";
import Notification from "./Notification.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps({
  notifications: {
    type: Array,
    required: true,
  },
  actions: {
    type: Array,
    default: [],
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits([
  "close",
  "action",
  "actionSelected",
  "notificationRead",
  "refresh",
]);

document.addEventListener("click", (event) => {
  if (
    !event.target.closest(".notifications") &&
    !event.target.closest(".navbar__notifications-button")
  ) {
    emits("close");
  }
});
</script>

<template>
  <div class="notifications" v-show="isOpen">
    <div class="notifications__head">
      <p class="notifications__title">Notifications</p>
      <button
        :class="[
          'notifications__refresh',
          {
            'notifications__refresh--loading': isLoading,
          },
        ]"
        @click="$emit('refresh')"
        :title="t('refresh_notifications')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M11.9438 2.05625C11.2962 1.40424 10.5259 0.886866 9.67745 0.533952C8.82896 0.181039 7.919 -0.000432561 7.00004 7.74239e-07C3.13254 7.74239e-07 0.00878906 3.1325 0.00878906 7C0.00878906 10.8675 3.13254 14 7.00004 14C10.2638 14 12.985 11.7688 13.7638 8.75H11.9438C11.5833 9.77333 10.9142 10.6596 10.0287 11.2865C9.14321 11.9134 8.08499 12.25 7.00004 12.25C4.10379 12.25 1.75004 9.89625 1.75004 7C1.75004 4.10375 4.10379 1.75 7.00004 1.75C8.45254 1.75 9.74754 2.35375 10.6925 3.3075L7.87504 6.125H14V7.74239e-07L11.9438 2.05625Z"
            fill="var(--white)"
          />
        </svg>
      </button>
    </div>
    <div
      :class="[
        'notifications__body',
        {
          'notifications__body--empty': notifications.length === 0,
        },
      ]"
    >
      <ul v-if="notifications.length > 0" class="notifications__list">
        <Notification
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
          :actions="actions"
          @action="$emit('action', $event)"
          @actionSelected="$emit('actionSelected', $event)"
          @notificationRead="$emit('notificationRead', $event)"
        />
      </ul>
      <p v-else>
        {{ t("no_notification_available") }}
      </p>
    </div>
  </div>
</template>
