import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
    function assetImgSrc(src: string) {
        return new URL(`../assets/imgs/${src}`, import.meta.url).href;
    }

    function getUploadsUrl(imageName: string) {
        return `http://localhost:3333/uploads/${imageName}`;
    }

    let localStorageUser: any = null;

    if(localStorage.getItem("user")) {
        localStorageUser = JSON.parse(localStorage.getItem("user") || "{}");
    }

    let id: any = null;
    let email: string = "";
    let pseudo: string = "";
    let grade: string = "";
    let imageName: string = "";
    let image: string = assetImgSrc("placeholder.jpg");
    let guild_id: any = null;

    if(localStorageUser) {
        id = localStorageUser.id;
        email = localStorageUser.email;
        pseudo = localStorageUser.pseudo;
        grade = localStorageUser.grade;
        guild_id = localStorageUser.guild_id;

        if(localStorageUser.image) {
            imageName = localStorageUser.image;
            image = getUploadsUrl(imageName);
        }
    }

    const user = ref({
        id: id,
        email: email,
        pseudo: pseudo,
        grade: grade,
        image: image,
        guild_id: guild_id,
    })

    const token = ref(localStorage.getItem("token") || "");

    function updateUser(newUser: any) {
        newUser = JSON.parse(newUser);
        user.value = newUser;
        localStorage.setItem('user', JSON.stringify(newUser));

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

    const isLogged = computed(() => {
        return token.value !== "";
    });

    function logout() {
        user.value = {
            id: null,
            email: "",
            pseudo: "",
            grade: "",
            image: assetImgSrc("placeholder.jpg"),
            guild_id: null,
        };
        token.value = "";
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    return {
        user,
        token,
        updateUser,
        updateToken,
        isLogged,
        logout,
    }
});