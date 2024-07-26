import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  let localStorageUser = null;

  if (localStorage.getItem("user")) {
    localStorageUser = JSON.parse(localStorage.getItem("user") || "{}");
  }

  let pseudo = "";
  let grade = "";
  let image = "placeholder.jpg";
  const user = ref({});

  user.value = {
    pseudo: pseudo,
    grade: grade,
    image: image,
  };

  if (localStorageUser) {
    pseudo = localStorageUser.pseudo;
    grade = localStorageUser.grade;
    image = localStorageUser.image;

    user.value = {
      pseudo: pseudo,
      grade: grade,
      image: image,
    };
  }

  const token = ref(localStorage.getItem("token") || "");

  function updateUser(newUser) {
    for (let key in newUser) {
      user.value[key] = newUser[key];
    }

    localStorage.setItem("user", JSON.stringify(user.value));
  }

  function updateToken(newToken) {
    token.value = newToken;
    localStorage.setItem("token", newToken);
  }

  function logout() {
    user.value = {};
    token.value = "";
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  const language = ref("en");

  function updateLanguage(newLanguage) {
    language.value = newLanguage;
  }

  return {
    user,
    token,
    updateUser,
    updateToken,
    logout,
    language,
    updateLanguage,
  };
});
