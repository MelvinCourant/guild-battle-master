<script setup>
import "../../assets/css/components/utils/_defense.scss";

const props = defineProps({
  member: {
    type: Object,
    required: true,
  },
  leader: {
    type: Object,
    required: true,
  },
  second: {
    type: Object,
    required: true,
  },
  third: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(["defenseHover", "defenseLeave", "clickOnDefense"]);

const env = import.meta.env;

function defenseHover(event) {
  emits("defenseHover", event.target);
}

function defenseLeave(event) {
  emits("defenseLeave", event.target);
}

function clickOnDefense() {
  emits("clickOnDefense", {
    member: props.member,
    leader: props.leader,
    second: props.second,
    third: props.third,
  });
}
</script>

<template>
  <div
    class="defense"
    @mouseenter="defenseHover"
    @mouseleave="defenseLeave"
    @click="clickOnDefense"
  >
    <div class="defense__member" v-if="member">
      {{ member.pseudo }}
    </div>
    <ul class="defense__monsters">
      <li class="defense__leader">
        <img
          :src="`${env.VITE_URL}/uploads/${leader.image}`"
          :alt="leader.unit_master_id"
          class="defense__image"
          width="80"
          height="80"
        />
      </li>
      <li class="defense__second">
        <img
          :src="`${env.VITE_URL}/uploads/${second.image}`"
          :alt="second.unit_master_id"
          class="defense__image"
          width="80"
          height="80"
        />
      </li>
      <li class="defense__third">
        <img
          :src="`${env.VITE_URL}/uploads/${third.image}`"
          :alt="third.unit_master_id"
          class="defense__image"
          width="80"
          height="80"
        />
      </li>
    </ul>
  </div>
</template>
