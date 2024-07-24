<script setup>
import "../assets/css/components/_member-profile.scss";
import { reactive, ref, watch } from "vue";
import "vue3-loading-skeleton/dist/style.css";
import { SkeletonLoader } from "vue3-loading-skeleton";
import { useUserStore } from "../stores/user.js";
import Avatar from "./utils/Avatar.vue";
import Grade from "./utils/Grade.vue";
import Field from "./utils/Field.vue";

const userStore = useUserStore();
const user = userStore.user;
const env = import.meta.env;

const props = defineProps({
  memberId: {
    type: Number,
    required: true,
  },
  pseudo: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  userIsTheMember: {
    type: Boolean,
    default: false,
  },
});
defineEmits(["updateImage"]);

const imageField = reactive({
  type: "file",
  name: "image",
  value: props.image,
  accept: "image/png, image/jpeg, image/jpg, image/webp",
});
const avatarLoaded = ref(null);
const inputFileImageLoaded = ref(null);

if (props.userIsTheMember) {
  inputFileImageLoaded.value = false;
} else {
  avatarLoaded.value = false;
}

watch(
  () => props.image,
  (newVal) => {
    memberImage.src = generateSrc(newVal);
  },
);

function generateSrc(src) {
  if (src === "placeholder.jpg") {
    return new URL("../../assets/imgs/placeholder.jpg", import.meta.url).href;
  } else {
    return `${env.VITE_URL}/uploads/${src}`;
  }
}

const memberImage = reactive({
  src: generateSrc(props.image),
  alt: props.pseudo,
});
</script>

<template>
  <div class="member-profile">
    <Avatar
      :src="image"
      :alt="pseudo"
      :className="'member-profile__image'"
      v-if="!userIsTheMember"
      @load="avatarLoaded = true"
    />

    <Field
      :attributes="imageField"
      :image="memberImage"
      v-if="userIsTheMember"
      v-show="
        inputFileImageLoaded !== null && inputFileImageLoaded === true && pseudo
      "
      @imageLoaded="inputFileImageLoaded = true"
      @sendValue="(inputName, value) => $emit('updateImage', inputName, value)"
    />

    <h1
      class="member-profile__pseudo"
      v-if="
        (avatarLoaded !== null && avatarLoaded === true && pseudo) ||
        (inputFileImageLoaded !== null &&
          inputFileImageLoaded === true &&
          pseudo)
      "
    >
      {{ pseudo }}
    </h1>
    <SkeletonLoader
      width="100"
      height="20"
      class="member-profile__skeleton-pseudo"
      v-else
    />

    <div
      class="member-profile__grade"
      v-if="
        (grade !== 'member' &&
          avatarLoaded !== null &&
          avatarLoaded === true &&
          pseudo) ||
        (grade !== 'member' &&
          inputFileImageLoaded !== null &&
          inputFileImageLoaded === true &&
          pseudo)
      "
    >
      <Grade :grade="grade" />
      {{ grade }}
    </div>
    <router-link
      :to="`/upload-json/${memberId}`"
      class="member-profile__update"
      v-if="
        (avatarLoaded !== null &&
          avatarLoaded === true &&
          pseudo &&
          user.role === 'leader') ||
        (avatarLoaded !== null &&
          avatarLoaded === true &&
          pseudo &&
          user.role === 'moderator') ||
        (avatarLoaded !== null &&
          avatarLoaded === true &&
          pseudo &&
          user.member_id === memberId) ||
        (inputFileImageLoaded !== null &&
          inputFileImageLoaded === true &&
          pseudo &&
          user.role === 'leader') ||
        (inputFileImageLoaded !== null &&
          inputFileImageLoaded === true &&
          pseudo &&
          user.role === 'moderator') ||
        (inputFileImageLoaded !== null &&
          inputFileImageLoaded === true &&
          pseudo &&
          user.member_id === memberId)
      "
    >
      Mettre à jour
    </router-link>
    <SkeletonLoader
      width="90"
      height="12"
      v-if="
        (avatarLoaded !== null &&
          avatarLoaded === false &&
          pseudo &&
          user.role === 'leader') ||
        (avatarLoaded !== null &&
          avatarLoaded === false &&
          pseudo &&
          user.role === 'moderator') ||
        (avatarLoaded !== null &&
          avatarLoaded === false &&
          pseudo &&
          user.member_id === memberId) ||
        (inputFileImageLoaded !== null &&
          inputFileImageLoaded === false &&
          pseudo &&
          user.role === 'leader') ||
        (inputFileImageLoaded !== null &&
          inputFileImageLoaded === false &&
          pseudo &&
          user.role === 'moderator') ||
        (inputFileImageLoaded !== null &&
          inputFileImageLoaded === false &&
          pseudo &&
          user.member_id === memberId)
      "
    />
  </div>
</template>
