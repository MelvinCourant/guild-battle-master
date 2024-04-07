import {ref} from "vue";
import { defineStore } from "pinia";

export const useMonstersStore = defineStore("monsters", () => {
    const monsters: any = ref([]);
    let localStorageMonsters: any = null;

    if(localStorage.getItem("monsters")) {
        localStorageMonsters = JSON.parse(localStorage.getItem("monsters") || "[]");
    }

    if(localStorageMonsters) {
        monsters.value = localStorageMonsters;
    }

    function getMonster(id: number) {
        return monsters.value.find((monster: any) => monster.id === id);
    }

    function setMonster(newMonsters: any) {
        monsters.value.push(newMonsters);
        localStorage.setItem("monsters", JSON.stringify(monsters.value));
    }

    return {
        monsters,
        getMonster,
        setMonster,
    }
});