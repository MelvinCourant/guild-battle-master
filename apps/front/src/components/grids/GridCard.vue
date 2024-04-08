<script setup lang="ts">
import '../../assets/css/components/grids/_grid-card.scss';
import More from "../utils/More.vue";
import Grade from "../utils/Grade.vue";
import Badge from "../utils/Badge.vue";

defineProps(
  {
    badges: {
      type: Object,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    content: {
      type: Object,
      required: true
    },
    actions: {
      type: Array,
      default: () => []
    }
  }
)

const env = import.meta.env;

function placeholderSrc() {
  return new URL('../../assets/imgs/placeholder.jpg', import.meta.url).href;
}

function othersText(numberMonsters: number) {
  if(numberMonsters - 3 > 1) {
    return `+${numberMonsters - 3} autres`;
  } else {
    return `+1 autre`;
  }
}
</script>

<template>
  <li class="grid-card">
    <div
        class="grid-card__actions"
    >
      <More
          v-if="actions"
          :actions="actions"
          @actionSelected="$emit('actionSelected', {
            action: $event,
            id: content.id
        })"
      />
    </div>
    <template
        v-for="(info, key, index) in content"
        :key="key"
    >
      <template
          v-if="key !== 'id'"
      >
        <img
          v-if="
            key === 'image' &&
            info !== 'placeholder.jpg'
          "
            :class="columns[index - 1].class"
            :src="`${env.VITE_URL}/uploads/${content.image}`"
            alt="avatar"
            loading="lazy"
        />
        <img
            v-else-if="
              key === 'image' &&
              info === 'placeholder.jpg'
            "
            :class="columns[index - 1].class"
            :src="placeholderSrc()"
            alt="avatar"
            loading="lazy"
        />
        <div
            v-else-if="key === 'grade'"
            :class="columns[index - 1].class + '-name'"
        >
          <Grade
              v-if="info !== 'member'"
              :grade="info"
          />
          <span>{{ info }}</span>
        </div>
        <ul
            v-else-if="badges.includes(key)"
            :class="columns[index - 1].class"
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
        <span
            v-else
            :class="columns[index - 1].class"
        >
          {{ info }}
        </span>
      </template>
    </template>
  </li>
</template>