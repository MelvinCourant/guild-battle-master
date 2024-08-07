<script setup>
import "../../assets/css/components/tables/_table-rows.scss";
import Badge from "../utils/Badge.vue";
import Grade from "../utils/Grade.vue";
import { inject, ref, watch } from "vue";
import More from "../utils/More.vue";
import Avatar from "../utils/Avatar.vue";
import { useI18n } from "vue-i18n";

defineEmits(["actionSelected"]);

const { t } = useI18n();
const data = ref(inject("data"));
const columns = inject("columns");
const rows = ref([]);
const badges = ref([]);
const link = ref("");

watch(data, () => {
  rows.value = data.value.rows;
  badges.value = data.value.badges;
  link.value = data.value.link;
});

function othersText(numberMonsters) {
  if (numberMonsters - 3 > 1) {
    return `+${numberMonsters - 3} ${t("others")}`;
  } else {
    return `+1 ${t("other")}`;
  }
}
</script>

<template>
  <tbody class="table-rows">
    <tr v-for="(row, index) in rows" :key="index">
      <template v-for="(info, key, index) in row" :key="row.id">
        <td
          v-if="key !== 'id'"
          :class="
            columns[0].key === 'id'
              ? columns[index].class
              : columns[index - 1].class
          "
        >
          <ul v-if="badges && badges.includes(key)">
            <template v-for="(monster, index) in info">
              <Badge
                v-if="index < 3"
                :key="monster.unit_master_id"
                :monstersIds="[monster.unit_master_id]"
                :name="monster.name"
                :element="monster.element"
              />
            </template>
            <Badge
              v-if="info.length > 3"
              :key="'others'"
              :monstersIds="
                info.slice(3).map((monster) => monster.unit_master_id)
              "
              :name="othersText(info.length)"
              element="dark-light"
            />
          </ul>
          <router-link :to="link + row.id" v-else-if="link && key === 'image'">
            <Avatar
              :className="'table-rows__image'"
              :src="info"
              :alt="row.pseudo"
              :disableSkeleton="true"
            />
          </router-link>
          <Avatar
            :className="'table-rows__image'"
            :src="info"
            :alt="row.pseudo"
            :disableSkeleton="true"
            v-else-if="!link && key === 'image'"
          />
          <div v-else-if="key === 'grade'" class="table-grid__grade-name">
            <Grade v-if="info !== 'member'" :grade="info" />
            <span>{{ info }}</span>
          </div>
          <router-link
            :to="link + row.id"
            v-else-if="(link && key === 'pseudo') || key === 'name'"
          >
            <span>{{ info }}</span>
          </router-link>
          <span v-else-if="(!link && key === 'pseudo') || key === 'name'">{{
            info
          }}</span>
          <span v-else>{{ info }}</span>
        </td>
        <td
          v-if="columns[index].key === 'id' && key === 'id'"
          :class="columns[index].class"
        >
          <router-link :to="link + row.id" v-if="link">
            <span>{{ info }}</span>
          </router-link>
          <span v-else>{{ info }}</span>
        </td>
        <td
          class="table-rows__actions"
          v-if="data.actions && index === Object.keys(row).length - 1"
        >
          <More
            :actions="data.actions"
            :memberRole="row.role"
            @actionSelected="
              $emit('actionSelected', {
                action: $event,
                id: row.id,
              })
            "
          />
        </td>
      </template>
    </tr>
  </tbody>
</template>
