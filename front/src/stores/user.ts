import { ref} from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
    const localStorageUser = localStorage.getItem("user");

    const user = ref({
        id: localStorageUser ? JSON.parse(localStorageUser).id : "",
        email: localStorageUser ? JSON.parse(localStorageUser).email : "",
        pseudo: localStorageUser ? JSON.parse(localStorageUser).pseudo : "",
        role: localStorageUser ? JSON.parse(localStorageUser).role : "",
        image: localStorageUser ? JSON.parse(localStorageUser).image : "",
    })

    const token = ref(localStorage.getItem("token") || "");

    function updateUser(newUser: any) {
        user.value = newUser;
    }

    function updateToken(newToken: string) {
        token.value = newToken;
    }

    return {
        user,
        token,
        updateUser,
        updateToken,
    }
});