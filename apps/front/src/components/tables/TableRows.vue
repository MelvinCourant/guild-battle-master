<script setup lang="ts">
import '../../assets/css/components/tables/_table-rows.scss'
import Badge from "../utils/Badge.vue";
import Grade from "../utils/Grade.vue";
import {inject, ref, watch} from "vue";
import More from "../utils/More.vue";

defineEmits(["actionSelected"]);

const data = ref(inject("data"));
const columns = inject("columns");
const rows = ref([]);
const badges = ref([]);
const env = import.meta.env;

watch(data, () => {
  rows.value = data.value.rows;
  badges.value = data.value.badges;
});

function placeholderSrc() {
  return new URL('../../assets/imgs/placeholder.jpg', import.meta.url).href;
}
</script>

<template>
  <tbody class="table-rows">
    <tr
      v-for="(row, index) in rows"
      :key="index"
    >
      <template
        v-for="(info, key, index) in row"
        :key="key"
      >
        <td
          v-if="key !== 'id'"
          :class="columns[index - 1].class"
        >
          <ul
              v-if="badges.includes(key)"
          >
            <template
                v-for="(monster, index) in info"
            >
              <Badge
                  v-if="index < 3"
                  :key="monster.id"
                  :monsterId="monster.id"
                  :name="monster.name"
                  :element="monster.element"
              />
            </template>
            <Badge
                v-if="info.length > 3"
                :key="'others'"
                :name="'+' + (info.length - 3) + ' autres'"
                element="dark-light"
            />
          </ul>
          <img
            v-else-if="
              key === 'image' &&
              info !== 'placeholder.jpg'
            "
            class="table-rows__image"
            :src="`${env.VITE_URL}/uploads/${info}`"
            alt="avatar"
            loading="lazy"
          />
          <img
            v-else-if="
              key === 'image' &&
              info === 'placeholder.jpg'
            "
            class="table-rows__image"
            :src="placeholderSrc()"
            alt="avatar"
            loading="lazy"
          />
          <div
              v-else-if="key === 'grade'"
              class="members__grade-name"
          >
            <Grade
                v-if="info !== 'member'"
                :grade="info"
            />
            <span>{{ info }}</span>
          </div>
          <span v-else>{{ info }}</span>
        </td>
      </template>
      <td
        class="table-rows__actions"
      >
        <More
          v-if="data.actions"
          :actions="data.actions"
          @actionSelected="$emit('actionSelected', {
            action: $event,
            id: row.id
          })"
        />
      </td>
    </tr>
  </tbody>
</template>