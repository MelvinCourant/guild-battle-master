import { ref } from "vue";
import { defineStore } from "pinia";

export const useMonstersStore = defineStore("monsters", () => {
  const monsters = ref([]);
  let localStorageMonsters = null;

  if (localStorage.getItem("monsters")) {
    localStorageMonsters = JSON.parse(localStorage.getItem("monsters") || "[]");
  }

  if (localStorageMonsters) {
    monsters.value = localStorageMonsters;
  }

  function getMonster(id) {
    return monsters.value.find((monster) => monster.unitMasterId === id);
  }

  function setMonster(newMonsters) {
    if (!getMonster(newMonsters.unitMasterId)) {
      monsters.value.push(newMonsters);
      localStorage.setItem("monsters", JSON.stringify(monsters.value));
    }
  }

  return {
    monsters,
    getMonster,
    setMonster,
  };
});
