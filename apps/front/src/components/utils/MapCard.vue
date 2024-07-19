<script setup>
import "../../assets/css/components/utils/_map-card.scss";
import Defense from "./Defense.vue";

defineProps({
  cardDetails: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div
    :class="[
      'map-card',
      {
        'map-card--tower': cardDetails.position,
      },
    ]"
  >
    <router-link
      :to="`/tower/${cardDetails.id}`"
      class="map-card__box"
      v-if="cardDetails.position"
    >
      <div v-if="cardDetails.position" class="map-card__position">
        <span class="map-card__number">
          {{ cardDetails.position }}
        </span>
      </div>
      <template v-if="cardDetails.defenses && cardDetails.defenses.length > 0">
        <Defense
          v-for="(defense, index) in cardDetails.defenses"
          :key="index"
          :member="defense.members"
          :leader="defense.leader"
          :second="defense.second"
          :third="defense.third"
        />
      </template>
      <Defense v-else-if="cardDetails.defenses.length === 0" :isEmpty="true" />
    </router-link>

    <div v-else class="map-card__box">
      <span class="map-card__member">
        {{ cardDetails.pseudo }}
      </span>
      <div class="map-card__assigned-defenses">
        <template
          v-if="cardDetails.defenses && cardDetails.defenses.length > 0"
        >
          <Defense
            v-for="(defense, index) in cardDetails.defenses"
            :key="index"
            :leader="defense.leader"
            :second="defense.second"
            :third="defense.third"
          />
        </template>
        <Defense
          v-else-if="cardDetails.defenses.length === 0"
          :isEmpty="true"
        />
      </div>
    </div>
  </div>
</template>
