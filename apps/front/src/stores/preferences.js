import { defineStore } from "pinia";
import { ref } from "vue";

export const usePreferencesStore = defineStore("preferences", () => {
    const preferences = ref({});

    if(localStorage.getItem("preferences")) {
        preferences.value = JSON.parse(localStorage.getItem("preferences") || "[]");
    }

    function updatePreferences(key, value) {
        if(preferences.value[key]) {
            preferences.value[key] = value;
        } else {
            preferences.value = {
                ...preferences.value,
                [key]: value
            }
        }

        localStorage.setItem('preferences', JSON.stringify(preferences.value));
    }

    return {
        preferences,
        updatePreferences
    }
});