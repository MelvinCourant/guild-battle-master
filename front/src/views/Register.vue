<script setup lang="ts">
  import "@css/views/login-register.scss";
  import FormPage from "@components/FormPage.vue";
  import {IStep, IFormContainer} from "@models/form.ts";
  import { reactive, ref, provide } from "vue";
  const env = import.meta.env;

  function generateImgSrc(src: string) {
    return new URL(`../assets/imgs/${src}`, import.meta.url).href;
  }

  const steps: IStep[] = [
      {
        level: 1,
        label: 'Compte',
        active: true,
      },
      {
        level: 2,
        label: 'Guilde',
        active: false,
      },
      {
        level: 3,
        label: 'Résumé',
        active: false,
      },
  ];
  const registerForm: IFormContainer = reactive({
    forms: [
      {
        id: 1,
        fields: [
          {
            image: {
              src: generateImgSrc('placeholder.jpg'),
              alt: 'User icon',
            },
            attributes: {
              type: 'file',
              name: 'image',
              accept: 'image/png, image/jpeg, image/jpg, image/webp',
            }
          },
          {
            label: 'Email*',
            attributes: {
              type: 'email',
              name: 'email',
              required: true,
            }
          },
          {
            label: 'Pseudo*',
            attributes: {
              type: 'text',
              name: 'pseudo',
              required: true,
            }
          },
          {
            label: "Mot de passe*",
            attributes: {
              type: 'password',
              name: 'password',
              required: true,
            }
          },
          {
            label: 'Confirmer le mot de passe*',
            attributes: {
              type: 'password',
              name: 'confirmationPassword',
              required: true,
            }
          },
          {
            attributes: {
              type: 'submit',
              value: 'Continuer',
              style: 'primary',
            }
          }
        ],
      },
      {
        id: 2,
        fields: [
          {
            label: 'Nom de la guilde*',
            attributes: {
              type: 'text',
              name: 'guildName',
              required: true,
            }
          },
          {
            label: 'Parcourir',
            attributes: {
              type: 'file',
              name: 'json',
              accept: 'application/JSON',
              style: 'primary',
            }
          },
          {
            attributes: {
              type: 'submit',
              value: 'Continuer',
              style: 'primary',
            }
          }
        ],
      }
    ],
    footerText: {
      text: 'Vous possédez déjà un compte ?',
      link: 'Connectez-vous',
      href: '/login',
    }
  });
  const currentStep = ref(1);
  const formValues = reactive({
    email: '',
    password: '',
    confirmationPassword: '',
    pseudo: '',
    guildName: '',
  });
  const image = ref<File | null>();
  const json = ref<File | null>();
  const canIncrement = ref(false);

  provide('formContainer', registerForm);

  function updateValue(inputName: string, value: string | File) {
    if(inputName === 'image') {
      image.value = value as File;
    } else if(inputName === 'email') {
      formValues.email = value as string;
    } else if(inputName === 'pseudo') {
      formValues.pseudo = value as string;
    } else if(inputName === 'password') {
      formValues.password = value as string;
    } else if(inputName === 'confirmationPassword') {
      formValues.confirmationPassword = value as string;
    } else if(inputName === 'guildName') {
      formValues.guildName = value as string;
    } else if(inputName === 'json') {
      json.value = value as File;
    }
  }

  function decrementStep() {
    if(
        currentStep.value > 1
    ) {
      currentStep.value--;
    }
  }

  async function sendUserMember() {
    let jsonFormat: any = {
      email: formValues.email,
      password: formValues.password,
      password_confirmation: formValues.confirmationPassword,
      pseudo: formValues.pseudo
    };

    if(image.value) {
      jsonFormat = {
        ...jsonFormat,
        image: image.value
      }
    }

    const formData = new FormData();

    for (const key in jsonFormat) {
      formData.append(key, jsonFormat[key]);
    }

    const result = await fetch(`${env.VITE_URL}/auth/register/1`, {
      method: 'POST',
      body: formData,
    });

    if(result.status === 201) {
      canIncrement.value = true;
      incrementStep();
    } else {
      canIncrement.value = false;

      const resultJson = await result.json();
      const errors = resultJson.errors;

      errors.forEach((error: any) => {
        registerForm.forms[0].fields.forEach((field: any) => {
          if(field.attributes.name === error.field) {
            field.error = error.message;
          }
        });
      });
    }
  }

  function sendDataForm() {
    if(
        formValues.email !== '' &&
        formValues.pseudo !== '' &&
        formValues.password !== '' &&
        currentStep.value === 1
    ) {
      registerForm.forms[0].fields.forEach((field: any) => {
        field.error = '';
      });
      sendUserMember();
    }
  }

  function incrementStep() {
    if (
        canIncrement.value &&
        currentStep.value < steps.length
    ) {
      currentStep.value++;
    }
  }
</script>

<template>
  <main class="register">
    <FormPage
        :steps="steps"
        :currentStep="currentStep"
        @sendValue="updateValue"
        @previousStep="decrementStep"
        @nextStep="sendDataForm"
    />
  </main>
</template>