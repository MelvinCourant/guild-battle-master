<script setup lang="ts">
import {inject, ref, watch} from "vue";
import Badge from "../utils/Badge.vue";

const columns = inject("columns");
const data = ref(inject("data"));
const rows = ref([]);
const badges = ref([]);
const env = import.meta.env;

watch(data, () => {
  rows.value = data.value.rows;
  badges.value = data.value.badges;
});

function assetPlaceholderSrc() {
  return new URL('../../assets/imgs/placeholder.jpg', import.meta.url).href;
}

</script>

<template>
  <table>
    <thead>
      <tr>
        <th
          v-for="column in columns"
          :key="column"
        >
          {{ column.name }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in rows" :key="index">
        <td v-for="(info, key) in row" :key="key">
          <ul
            v-if="badges.includes(key)"
          >
            <template
              v-for="(monster, index) in info"
            >
              <Badge
                v-if="index < 7"
                :key="monster.name"
                :name="monster.name"
                :element="monster.element"
              />
            </template>
            <Badge
              v-if="info.length > 7"
              :key="'others'"
              :name="'+' + (info.length - 7) + ' autres'"
              element="dark-light"
            />
          </ul>
          <img
            v-else-if="
              key === 'image' &&
              info !== 'placeholder.jpg'
            "
            :src="`${env.VITE_URL}/uploads/${info}`"
            alt="avatar"
            width="28"
            height="28"
          />
          <img
              v-else-if="
                key === 'image' &&
                info === 'placeholder.jpg'
              "
              :src="assetPlaceholderSrc()"
              alt="avatar"
              width="28"
              height="28"
          />
          <span v-else>{{ info }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>