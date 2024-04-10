<script setup lang="ts">
  import { inject } from "vue";
  import { ISubmenuLink } from "../../../models/navbar.ts";
  import '../../../assets/css/components/menus/mobile/_submenu-mobile.scss'
  import Grade from "../../../components/utils/Grade.vue";
  import Avatar from "../../utils/Avatar.vue";

  defineProps({
    isOpened: {
      type: Boolean,
      default: false,
    }
  });
  defineEmits(['closeSubmenu']);

  const userProfile: any = inject('userProfile');
  const submenu: Array<ISubmenuLink> | undefined = inject('submenu');

  function generateIconPath(icon: string): string {
    return new URL(`../../../assets/imgs/icons/${icon}.svg`, import.meta.url).href;
  }
</script>

<template>
  <ul
      class="submenu-mobile"
      :class="isOpened ? 'submenu-mobile--open' : ''"
  >
    <li class="user-profile">
      <Avatar
          :className="'user-profile__avatar'"
          :src="userProfile.image"
          :alt="userProfile.pseudo"
      />
      <div class="user-profile__identity">
        <Grade
            :grade="userProfile.grade"
            v-if="userProfile.grade !== 'member'"
        />
        <span class="user-profile__pseudo">
          {{ userProfile.pseudo }}
        </span>
      </div>
    </li>
    <li class="submenu-mobile__nav">
      <nav>
        <ul class="submenu-mobile__list">
          <template
              v-for="(link, index) in submenu"
              :key="index"
              class="submenu-mobile__line"
          >
            <li
                v-if="
                  submenu &&
                  index !== submenu.length - 1
                "
            >
              <router-link
                  :to="link.path"
                  @click="$emit('closeSubmenu')"
                  class="submenu-mobile__link"
              >
                <div class="submenu-mobile__icon">
                  <img
                      :src="generateIconPath(link.icon)"
                      alt="link.icon"
                  />
                </div>
                <span class="submenu-mobile__text">
                {{ link.text }}
              </span>
              </router-link>
            </li>
          </template>
        </ul>
        <div
            class="submenu-mobile__footer"
            v-if="submenu"
        >
          <router-link
              :to="submenu[submenu.length - 1].path"
              @click="$emit('closeSubmenu')"
              class="submenu-mobile__link"
          >
            <div class="submenu-mobile__icon">
              <img
                  :src="generateIconPath(submenu[submenu.length - 1].icon)"
                  alt="link.icon"
              />
            </div>
            <span class="submenu-mobile__text">
                {{ submenu[submenu.length - 1].text }}
              </span>
          </router-link>
        </div>
      </nav>
    </li>
  </ul>
  <div
      class="trigger"
      v-show="isOpened"
      @click="$emit('closeSubmenu')"
  ></div>
</template>