<script setup>
import "../../assets/css/components/utils/_defense.scss";
import { useI18n } from "vue-i18n";

const props = defineProps({
  member: {
    type: Object,
  },
  leader: {
    type: Object,
  },
  second: {
    type: Object,
  },
  third: {
    type: Object,
  },
  isEmpty: {
    type: Boolean,
    default: false,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["defenseHover", "defenseLeave", "clickOnDefense"]);

const { t } = useI18n();
const env = import.meta.env;

function defenseHover(event) {
  emits("defenseHover", event.target);
}

function defenseLeave(event) {
  emits("defenseLeave", event.target);
}

function clickOnDefense() {
  if (document.querySelector(".defense__add")) {
    document.querySelector(".defense__add").remove();
  } else if (document.querySelector(".defense__remove")) {
    document.querySelector(".defense__remove").remove();
  }

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
    :class="[
      'defense',
      {
        'defense--empty': isEmpty,
      },
    ]"
    @mouseenter="defenseHover"
    @mouseleave="defenseLeave"
    @click="clickOnDefense"
  >
    <span class="defense__member" v-if="member && member.pseudo">
      {{ member.pseudo }}
    </span>
    <span class="defense__member" v-else-if="member && !member.pseudo">
      {{ member }}
    </span>
    <span class="defense__member" v-if="isEmpty"> {{ t("no_defense") }} </span>
    <span
      class="defense__member--empty"
      v-else-if="!member && !leader && !second && !third"
    >
      {{ t("no_defense") }}
    </span>
    <ul class="defense__monsters">
      <li class="defense__leader">
        <img
          v-if="!isEmpty && leader && leader.image"
          :src="`${env.VITE_URL}/uploads/${leader.image}`"
          :alt="leader.unit_master_id"
          class="defense__image"
          width="80"
          height="80"
        />
      </li>
      <li class="defense__second">
        <img
          v-if="!isEmpty && second && second.image"
          :src="`${env.VITE_URL}/uploads/${second.image}`"
          :alt="second.unit_master_id"
          class="defense__image"
          width="80"
          height="80"
        />
      </li>
      <li class="defense__third">
        <img
          v-if="!isEmpty && third && third.image"
          :src="`${env.VITE_URL}/uploads/${third.image}`"
          :alt="third.unit_master_id"
          class="defense__image"
          width="80"
          height="80"
        />
      </li>
    </ul>
    <div class="defense__selected" v-if="isSelected"></div>
  </div>
</template>
