<script setup lang="ts">
import '../../assets/css/components/utils/_badge.scss'
import {onMounted, reactive, ref} from 'vue'
import { useMonstersStore } from "../../stores/monsters.ts";
import Tooltip from "./Tooltip.vue";

const env = import.meta.env;
const props = defineProps({
  monsterId: {
    type: Number
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
const monster: any = ref(null);
const monsterImage = reactive({
  src: '',
  alt: ''
});
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

async function getMonster(id: number) {
  if(!monster.value) {
    await getMonsterFromDb(id).then((data) => {
      monster.value = data;
      monstersStore.setMonster(monster.value);
    });
    monsterImage.src = `${env.VITE_URL}/uploads/${monster.value.image}`;
    monsterImage.alt = monster.name;
  } else {
    monsterImage.src = `${env.VITE_URL}/uploads/${monster.value.image}`;
    monsterImage.alt = monster.name;
  }
}

onMounted(async () => {
  if(props.monsterId) {
    monster.value = monstersStore.getMonster(props.monsterId);
    await getMonster(props.monsterId);
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
          monsterImage.src &&
          tooltipIsDisplayed
        "
        :img="monsterImage"
    />
  </li>
</template>