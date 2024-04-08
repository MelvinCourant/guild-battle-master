<script setup lang="ts">
import '../../assets/css/components/utils/_badge.scss'
import {onMounted, reactive, ref} from 'vue'
import { useMonstersStore } from "../../stores/monsters.ts";
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
const monstersImages = ref([]) as any;
const tooltipIsDisplayed = ref(false);

async function getMonsterFromDb(id: number) {
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

async function getMonsters(monstersIds: any) {
  if(monsters.value.length === 0) {
    for (const id of monstersIds) {
      await getMonsterFromDb(id).then((monster) => {
        monsters.value.push(monster);
        monstersStore.setMonster(monster);
        monstersImages.value.push({
          src: `${env.VITE_URL}/uploads/${monster.image}`,
          alt: monster.name
        });
      });
    }
  } else {
    monsters.value.forEach((monster: any) => {
      monstersImages.value.push({
        src: `${env.VITE_URL}/uploads/${monster.image}`,
        alt: monster.name
      });
    });
  }
}

onMounted(async () => {
  if(props.monstersIds) {
    for (const id of props.monstersIds) {
      const monster = monstersStore.getMonster(id);

      if(monster) {
        monsters.value.push(monster);
      }
    }

    await getMonsters(props.monstersIds);
  }
});
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
    <span class="badge__name">
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