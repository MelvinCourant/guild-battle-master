<script setup>
import '../../assets/css/components/utils/_badge.scss'
import {ref} from 'vue'
import { useMonstersStore } from "../../stores/monsters.js";
import Tooltip from "./Tooltip.vue";

const env = import.meta.env;
const props = defineProps({
  monstersIds: {
    type: Array
  },
  name: {
    type: String,
    required: true
  },
  element: {
    type: String,
    required: true
  },
  canBeDeleted: {
    type: Boolean,
    default: false
  }
});
const monstersStore = useMonstersStore();
const monsters = ref([]);
const monstersImages = ref([]);
const tooltipIsDisplayed = ref(false);

defineEmits(['deleteBadge']);

async function getMonsterFromDb(id) {
  const result = await fetch(`${env.VITE_URL}/api/monsters/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  return await result.json();
}

async function getMonstersImages() {
  if(props.canBeDeleted) {
    return;
  }

  if(props.monstersIds) {
    for (const id of props.monstersIds) {
      const monster = monstersStore.getMonster(id);

      if(monster) {
        monsters.value.push(monster);
        monstersImages.value.push({
          src: `${env.VITE_URL}/uploads/${monster.image}`,
          alt: monster.name
        });
      } else {
        await getMonsterFromDb(id).then((monster) => {
          monsters.value.push(monster);
          monstersStore.setMonster(monster);
          monstersImages.value.push({
            src: `${env.VITE_URL}/uploads/${monster.image}`,
            alt: monster.name
          });
        });
      }
    }
  }
}

getMonstersImages();
</script>

<template>
  <li
    :class="[
      'badge',
      `badge--${element}`,
      {'badge--deletable': canBeDeleted},
    ]"
    @mouseover="tooltipIsDisplayed = true"
    @mouseleave="tooltipIsDisplayed = false"
    @click="$emit('deleteBadge')"
  >
    <div
        v-if="element === 'dark-light'"
        class="badge__wrapper"
    >
      <div class="badge__container">
        <span class="badge__name">
          {{ name }}
        </span>
        <svg
          class="badge__cross"
          v-if="canBeDeleted"
          xmlns="http://www.w3.org/2000/svg" width="8" height="7" viewBox="0 0 8 7" fill="none">
          <path d="M7.5 0.705L6.795 0L4 2.795L1.205 0L0.5 0.705L3.295 3.5L0.5 6.295L1.205 7L4 4.205L6.795 7L7.5 6.295L4.705 3.5L7.5 0.705Z" fill="url(#paint0_linear_790_3407)"/>
          <defs>
            <linearGradient id="paint0_linear_790_3407" x1="16" y1="3.5" x2="-71" y2="3.5" gradientUnits="userSpaceOnUse">
              <stop stop-color="white"/>
              <stop offset="1" stop-color="#7C00DE"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
    <span
        v-else
        class="badge__name"
    >
      {{ name }}
    </span>
    <svg
      class="badge__cross"
      v-if="element !== 'dark-light' && canBeDeleted"
      xmlns="http://www.w3.org/2000/svg" width="8" height="7" viewBox="0 0 8 7" fill="none"
    >
      <path d="M7.5 0.705L6.795 0L4 2.795L1.205 0L0.5 0.705L3.295 3.5L0.5 6.295L1.205 7L4 4.205L6.795 7L7.5 6.295L4.705 3.5L7.5 0.705Z" fill="white"/>
    </svg>
    <Tooltip
        v-show="
          monstersImages &&
          tooltipIsDisplayed
        "
        v-if="!canBeDeleted"
        :imgs="monstersImages"
    />
  </li>
</template>