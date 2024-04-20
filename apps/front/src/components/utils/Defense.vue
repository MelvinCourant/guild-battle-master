<script setup>
import '../../assets/css/components/utils/_defense.scss';

defineProps({
  member: {
    type: String,
    required: ''
  },
  leader: {
    type: Object,
    required: true
  },
  second: {
    type: Object,
    required: true
  },
  third: {
    type: Object,
    required: true
  }
})

const env = import.meta.env;
</script>

<template>
  <div class="defense">
    <div
        class="defense__member"
        v-if="member"
    >
      {{ member }}
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