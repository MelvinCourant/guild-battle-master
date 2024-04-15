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
  }
});
const monstersStore = useMonstersStore();
const monsters = ref([]);
const monstersImages = ref([]);
const tooltipIsDisplayed = ref(false);

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
      `badge--${element}`
    ]"
    @mouseover="tooltipIsDisplayed = true"
    @mouseleave="tooltipIsDisplayed = false"
  >
    <div
        v-if="element === 'dark-light'"
        class="badge__wrapper"
    >
      <div class="badge__container">
        <span class="badge__name">
        {{ name }}
      </span>
      </div>
    </div>
    <span
        v-else
        class="badge__name"
    >
      {{ name }}
    </span>
    <Tooltip
        v-show="
          monstersImages &&
          tooltipIsDisplayed
        "
        :imgs="monstersImages"
    />
  </li>
</template>