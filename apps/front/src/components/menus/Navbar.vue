<script setup>
import { useUserStore } from "../../stores/user.js";
import "../../assets/css/components/menus/_navbar.scss";
import { useRoute } from "vue-router";
import logo from "../../assets/imgs/logo.svg";
import AccountMenu from "../../components/menus/AccountMenu.vue";
import NavbarMobile from "../../components/menus/mobile/NavbarMobile.vue";
import { provide, ref, watch } from "vue";
import Notifications from "./Notifications.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const env = import.meta.env;
const userDesktopLinks = [
  {
    name: t("guild"),
    path: "/",
    selected: false,
  },
  {
    name: t("siege_map"),
    path: "/map",
    selected: false,
  },
  {
    name: t("defenses"),
    path: "/defenses",
    selected: false,
  },
];
const userMobileLinks = ref([
  {
    name: t("guild"),
    path: "/",
    selected: false,
  },
  {
    name: t("siege_map"),
    path: "/map",
    selected: false,
  },
  {
    name: t("defenses"),
    path: "/defenses",
    selected: false,
  },
  {
    name: t("notifications"),
    path: "/notifications",
    selected: false,
  },
]);
const adminDesktopLinks = [
  {
    name: t("guilds"),
    path: "/admin",
  },
  {
    name: t("users"),
    path: "/admin/users",
  },
];
const desktopLinks = ref([]);
const mobileLinks = ref([]);
const route = useRoute();
const userStore = useUserStore();
const user = userStore.user;
const token = userStore.token;
const userProfile = ref({
  pseudo: user.pseudo,
  image: user.image,
  grade: user.grade,
});
const userSubmenu = [
  {
    icon: "profile",
    text: t("member_profile"),
    path: "/member",
  },
  {
    icon: "upload",
    text: t("upload_json"),
    path: "/upload-json",
  },
  {
    icon: "information",
    text: t("about_us"),
    path: "/about-us",
  },
  {
    icon: "logout",
    text: t("logout"),
    path: "/logout",
  },
];
const adminSubmenu = [
  {
    icon: "information",
    text: t("about_us"),
    path: "/about-us",
  },
  {
    icon: "logout",
    text: t("logout"),
    path: "/logout",
  },
];
const submenu = ref([]);
const onMobile = ref(false);
const notifications = ref([]);
const notificationsOpen = ref(false);
const notificationsLoading = ref(false);
const actionsNotifications = [
  {
    name: "read",
    label: t("mark_as_read"),
    danger: false,
  },
  {
    name: "delete",
    label: t("delete"),
    danger: true,
  },
];

provide("submenu", submenu);
provide("userProfile", userProfile);
provide("onMobile", onMobile);

function initNavbar() {
  if (user.role === "admin") {
    desktopLinks.value = adminDesktopLinks;
    mobileLinks.value = adminDesktopLinks.value;
    submenu.value = adminSubmenu;
  } else {
    desktopLinks.value = userDesktopLinks;
    mobileLinks.value = userMobileLinks.value;
    submenu.value = userSubmenu;
  }
}

initNavbar();

watch(
  () => userStore.user,
  (newUser) => {
    userProfile.value = {
      pseudo: newUser.pseudo,
      image: newUser.image,
      grade: newUser.grade,
    };
    initNavbar();
  },
  { deep: true },
);

function handleMobile() {
  if (
    (window.innerWidth <= 768 && !onMobile.value) ||
    (window.innerWidth > 768 && onMobile.value)
  ) {
    onMobile.value = !onMobile.value;

    if (!onMobile.value) {
      getNotifications();
    }
  }
}

handleMobile();
window.addEventListener("resize", handleMobile);

async function getNotifications() {
  const result = await fetch(`${env.VITE_URL}/api/notifications`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Accept-Language": userStore.language,
    },
  });

  if (result.ok) {
    const resultJson = await result.json();
    notifications.value = resultJson.notifications;
  }
}

getNotifications();

async function bequeathLeader(value, notificationId) {
  const result = await fetch(`${env.VITE_URL}/api/users/bequeath-leader`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Accept-Language": userStore.language,
    },
    body: JSON.stringify({
      notification_id: notificationId,
      accept: value,
    }),
  });

  if (result.ok) {
    await getNotifications();
  }
}

async function madeNotificationsAction(event) {
  if (event.action === "bequeath_leader") {
    let actionValue;

    if (event.value === true) {
      actionValue = 1;
    } else {
      actionValue = 0;
    }

    await bequeathLeader(actionValue, event.notificationId);
  }
}

async function readNotification(notificationId) {
  const result = await fetch(
    `${env.VITE_URL}/api/notifications/${notificationId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": userStore.language,
      },
    },
  );

  if (result.ok) {
    await getNotifications();
  }
}

async function deleteNotification(notificationId) {
  const result = await fetch(
    `${env.VITE_URL}/api/notifications/${notificationId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": userStore.language,
      },
    },
  );

  if (result.ok) {
    await getNotifications();
  }
}

async function actionSelected(event) {
  if (event.action === "read") {
    await readNotification(event.id);
  } else if (event.action === "delete") {
    await deleteNotification(event.id);
  }
}

async function refreshNotifications() {
  notificationsLoading.value = true;
  await getNotifications();
  notificationsLoading.value = false;
}
</script>

<template>
  <header class="navbar">
    <nav class="navbar__nav">
      <ul class="navbar__list">
        <li class="navbar__left">
          <router-link to="/" title="Aller à l'accueil">
            <img
              class="navbar__logo"
              :src="logo"
              alt="Guild battle Master logo"
            />
          </router-link>
          <router-link to="/" class="navbar__gbm"
            >Guild battle Master</router-link
          >
        </li>
        <li v-show="!onMobile" :aria-hidden="onMobile">
          <ul class="navbar__center">
            <li v-for="desktopLink in desktopLinks" :key="desktopLink.name">
              <router-link
                :to="desktopLink.path"
                class="navbar__link"
                :class="{
                  'navbar__link--selected': desktopLink.path === route.path,
                }"
              >
                {{ desktopLink.name }}
              </router-link>
            </li>
          </ul>
        </li>
        <li v-show="onMobile" :aria-hidden="!onMobile">
          <NavbarMobile
            :mobileLinks="mobileLinks"
            :notifications="notifications"
          />
        </li>
        <li>
          <ul class="navbar__right">
            <li
              v-show="!onMobile"
              :aria-hidden="onMobile"
              class="navbar__notifications"
            >
              <button
                :class="[
                  'navbar__notifications-button',
                  {
                    'navbar__notifications-button--unread':
                      notifications[0] && !notifications[0].isRead,
                  },
                ]"
                @click="notificationsOpen = !notificationsOpen"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="18"
                  viewBox="0 0 16 18"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.4998 7.85417V12.4375L15.3332 14.2708V15.1875H0.666504V14.2708L2.49984 12.4375V7.85417C2.49984 5.03083 3.994 2.68417 6.62484 2.06083V1.4375C6.62484 0.676667 7.239 0.0625 7.99984 0.0625C8.76067 0.0625 9.37484 0.676667 9.37484 1.4375V2.06083C11.9965 2.68417 13.4998 5.04 13.4998 7.85417ZM9.83317 16.1042C9.83317 16.5904 9.64002 17.0567 9.2962 17.4005C8.95238 17.7443 8.48607 17.9375 7.99984 17.9375C7.51361 17.9375 7.04729 17.7443 6.70348 17.4005C6.35966 17.0567 6.1665 16.5904 6.1665 16.1042H9.83317Z"
                    fill="white"
                  />
                </svg>
              </button>
              <Notifications
                :notifications="notifications"
                :isOpen="notificationsOpen"
                :actions="actionsNotifications"
                :isLoading="notificationsLoading"
                @close="notificationsOpen = false"
                @action="madeNotificationsAction"
                @actionSelected="actionSelected"
                @notificationRead="readNotification"
                @refresh="refreshNotifications"
              />
            </li>
            <li>
              <AccountMenu :userImage="user.image" />
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </header>
</template>
