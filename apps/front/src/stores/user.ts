import { ref, computed } from "vue";
import { defineStore } from "pinia";

const env = import.meta.env;

export const useUserStore = defineStore("user", () => {
    function assetImgSrc(src: string) {
        return new URL(`../assets/imgs/${src}`, import.meta.url).href;
    }

    function getUploadsUrl(imageName: string) {
        return `${env.VITE_URL}/uploads/${imageName}`;
    }

    let localStorageUser: any = null;

    if(localStorage.getItem("user")) {
        localStorageUser = JSON.parse(localStorage.getItem("user") || "{}");
    }

    let pseudo: string = "";
    let grade: string = "";
    let imageName: string = "";
    let image: string = assetImgSrc("placeholder.jpg");
    const user = ref({})

    user.value = {
        pseudo: pseudo,
        grade: grade,
        image: image,
    }

    if(localStorageUser) {
        pseudo = localStorageUser.pseudo;
        grade = localStorageUser.grade;

        if(localStorageUser.image) {
            imageName = localStorageUser.image;
            image = getUploadsUrl(imageName);
        }

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

        const newImage = newUser.image;
        if(newImage) {
            user.value.image = getUploadsUrl(newImage);
        } else {
            user.value.image = assetImgSrc("placeholder.jpg");
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