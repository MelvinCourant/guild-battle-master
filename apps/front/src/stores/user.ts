import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
    let localStorageUser: any = null;

    if(localStorage.getItem("user")) {
        localStorageUser = JSON.parse(localStorage.getItem("user") || "{}");
    }

    let pseudo: string = "";
    let grade: string = "";
    let image: string = "";
    const user = ref({})

    user.value = {
        pseudo: pseudo,
        grade: grade,
        image: image,
    }

    if(localStorageUser) {
        pseudo = localStorageUser.pseudo;
        grade = localStorageUser.grade;
        image = localStorageUser.image;

        user.value = {
            pseudo: pseudo,
            grade: grade,
            image: image,
        }
    }

    const token = ref(localStorage.getItem("token") || "");

    function updateUser(newUser: any, isLoginPage: boolean = false) {
        user.value = newUser;

        if(isLoginPage) {
            localStorage.setItem('user', JSON.stringify(newUser));
        }
    }

    function updateToken(newToken: string) {
        token.value = newToken;
        localStorage.setItem('token', newToken);
    }

    function logout() {
        user.value = {};
        token.value = "";
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    return {
        user,
        token,
        updateUser,
        updateToken,
        logout,
    }
});