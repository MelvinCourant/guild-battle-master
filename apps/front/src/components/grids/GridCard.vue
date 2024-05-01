<script setup>
import "../../assets/css/components/grids/_grid-card.scss";
import More from "../utils/More.vue";
import Grade from "../utils/Grade.vue";
import Badge from "../utils/Badge.vue";
import { inject } from "vue";
import Avatar from "../utils/Avatar.vue";

defineProps({
  link: {
    type: String,
    required: true,
  },
  badges: {
    type: Object,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  content: {
    type: Object,
    required: true,
  },
  actions: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["actionSelected"]);

const env = import.meta.env;

function othersText(numberMonsters) {
  if (numberMonsters - 3 > 1) {
    return `+${numberMonsters - 3} autres`;
  } else {
    return `+1 autre`;
  }
}
</script>

<template>
  <li class="grid-card">
    <div v-if="actions" class="grid-card__actions-container">
      <div class="grid-card__actions">
        <More
          v-if="actions"
          :actions="actions"
          :memberRole="content.role"
          orientation="right"
          @actionSelected="
            $emit('actionSelected', {
              action: $event,
              id: content.id,
            })
          "
        />
      </div>
    </div>
    <template v-for="(info, key, index) in content" :key="key">
      <template v-if="key !== 'id'">
        <router-link v-if="key === 'image'" :to="link + content.id">
          <Avatar
            :class="columns[index - 1].class"
            :src="content.image"
            :alt="content.pseudo"
          />
        </router-link>
        <div
          v-else-if="key === 'grade'"
          :class="columns[index - 1].class + '-name'"
        >
          <Grade v-if="info !== 'member'" :grade="info" />
          <span>{{ info }}</span>
        </div>
        <ul v-else-if="badges.includes(key)" :class="columns[index - 1].class">
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
        <router-link :to="link + content.id" v-else-if="key === 'pseudo'">
          <span :class="columns[index - 1].class">
            {{ info }}
          </span>
        </router-link>
        <span v-else :class="columns[index - 1].class">
          {{ info }}
        </span>
      </template>
    </template>
  </li>
</template>
