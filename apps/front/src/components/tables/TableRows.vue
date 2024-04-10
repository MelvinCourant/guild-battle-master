<script setup>
import '../../assets/css/components/tables/_table-rows.scss'
import Badge from "../utils/Badge.vue";
import Grade from "../utils/Grade.vue";
import {inject, ref, watch} from "vue";
import More from "../utils/More.vue";
import Avatar from "../utils/Avatar.vue";

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

function othersText(numberMonsters) {
  if(numberMonsters - 3 > 1) {
    return `+${numberMonsters - 3} autres`;
  } else {
    return `+1 autre`;
  }
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
        :key="row.id"
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
                  :monstersIds="[monster.id]"
                  :name="monster.name"
                  :element="monster.element"
              />
            </template>
            <Badge
                v-if="info.length > 3"
                :key="'others'"
                :monstersIds="info.slice(3).map(monster => monster.id)"
                :name="othersText(info.length)"
                element="dark-light"
            />
          </ul>
          <Avatar
            v-else-if="key === 'image'"
            :class="'table-rows__image'"
            :src="info"
            :alt="row.pseudo"
          />
          <div
              v-else-if="key === 'grade'"
              class="table-grid__grade-name"
          >
            <Grade
                v-if="info !== 'member'"
                :grade="info"
            />
            <span>{{ info }}</span>
          </div>
          <span v-else>{{ info }}</span>
        </td>
        <td
            class="table-rows__actions"
            v-if="index === Object.keys(row).length - 1"
        >
          <More
              :actions="data.actions"
              :memberRole="row.role"
              @actionSelected="$emit('actionSelected', {
                action: $event,
                id: row.id
              })"
          />
        </td>
      </template>
    </tr>
  </tbody>
</template>