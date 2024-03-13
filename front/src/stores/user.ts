import { ref} from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
    function assetImgSrc(src: string) {
        return new URL(`../assets/imgs/${src}`, import.meta.url).href;
    }

    function getUploadsUrl(imageName: string) {
        return `http://localhost:3333/uploads/${imageName}`;
    }

    const localStorageUser: any = JSON.parse(localStorage.getItem("user"));
    const id: number = localStorageUser.id;
    const email: string = localStorageUser.email;
    const pseudo: string = localStorageUser.pseudo;
    const imageName: string = localStorageUser.image;
    const image: string = getUploadsUrl(imageName);
    const placeholderImg: string =  assetImgSrc("placeholder.jpg")

    const user = ref({
        id: localStorageUser ? id : "",
        email: localStorageUser ? email : "john.doe@gmail.com",
        pseudo: localStorageUser ? pseudo : "John Doe",
        image: localStorageUser ? image : placeholderImg,
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