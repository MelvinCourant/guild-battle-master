<script setup lang="ts">
import '../../assets/css/components/tables/_table-rows.scss'
import Badge from "../utils/Badge.vue";
import Grade from "../utils/Grade.vue";
import {inject, ref, watch} from "vue";

const data = ref(inject("data"));
const columns = inject("columns");
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
  <tbody class="table-rows">
    <tr
      v-for="(row, index) in rows"
      :key="index"
    >
      <td
        v-for="(info, key, index) in row"
        :key="key"
        :class="columns[index].class"
      >
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
        />
        <img
          v-else-if="
                    key === 'image' &&
                    info === 'placeholder.jpg'
                  "
          :src="assetPlaceholderSrc()"
          alt="avatar"
        />
        <div
          v-else-if="key === 'grade'"
          class="members__grade-name"
        >
          <Grade
            v-if="info !== 'member'"
            :grade="info"
          />
          <span
            v-else
            class="members__grade--member"
          >
                  💩
          </span>
          <span>{{ info }}</span>
        </div>
        <span v-else>{{ info }}</span>
      </td>
    </tr>
  </tbody>
</template>