<script setup lang="ts">
  import "../assets/css/views/_login-register.scss";
  import FormPage from "../components/FormPage.vue";
  import Alert from "../components/utils/Alert.vue";
  import { IStep, IFormContainer } from "../models/form.ts";
  import { IAlert } from "../models/alert.ts";
  import { reactive, ref, provide } from "vue";
  import { useRouter } from "vue-router";

  const env = import.meta.env;
  const router = useRouter();

  function generateImgSrc(src: string) {
    return new URL(`../assets/imgs/${src}`, import.meta.url).href;
  }

  const placeholderImage = generateImgSrc('placeholder.jpg');
  const leaderImage = generateImgSrc('roles/leader.svg');
  const membersImage = generateImgSrc('members.svg');
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
              src: placeholderImage,
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
              autocomplete: 'email',
            }
          },
          {
            label: 'Pseudo*',
            attributes: {
              type: 'text',
              name: 'pseudo',
              required: true,
              autocomplete: 'username'
            }
          },
          {
            label: "Mot de passe*",
            attributes: {
              type: 'password',
              name: 'password',
              required: true,
              autocomplete: 'new-password',
            }
          },
          {
            label: 'Confirmer le mot de passe*',
            attributes: {
              type: 'password',
              name: 'confirmationPassword',
              required: true,
              autocomplete: 'new-password',
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
              autocomplete: 'organization',
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
              type: 'button',
              value: 'Continuer',
              style: 'primary',
            }
          }
        ],
      }
    ],
    resume: {
      id: 3,
      content: [
        {
          type: 'image',
          image: {
            src: placeholderImage,
            alt: 'User icon',
          }
        },
        {
          type: 'title',
          text: 'Guild Name'
        },
        {
          type: 'text',
          image: {
            src: leaderImage,
            alt: 'Leader icon',
          },
          text: 'Leader'
        },
        {
          type: 'text',
          image: {
            src: membersImage,
            alt: 'Members icon',
          },
          text: '1 membre (vous)'
        }
      ],
      submit: {
        attributes: {
          type: 'button',
          value: 'Valider',
          style: 'primary',
        }
      }
    },
    footerText: {
      text: 'Vous possédez déjà un compte ?',
      link: 'Connectez-vous',
      href: '/login',
    }
  });
  const alert: IAlert = reactive({
    display: false,
    message: '',
  });
  const currentStep = ref(1);
  const formValues = reactive({
    email: '',
    password: '',
    confirmationPassword: '',
    pseudo: '',
    guildName: '',
  });
  const memberImage = ref<File | null>();
  const json = ref<File | null>();
  const formStepOne = registerForm.forms[0];
  const formFieldsStepOne = formStepOne.fields;
  const formStepTwo = registerForm.forms[1];
  const formFieldsStepTwo = formStepTwo.fields;
  const resume = registerForm.resume;
  const resumeContent = resume?.content;
  const canIncrement = ref(false);

  provide('formContainer', registerForm);

  function updateValue(inputName: string, value: string | File) {
    if(inputName === 'image') {
      memberImage.value = value as File;
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

  function displayError(fields: any, resultJson: any) {
    let errorsFields: any;
    let globalError: any;

    if(resultJson.errors) {
      errorsFields = resultJson.errors;
    } else {
      globalError = resultJson.message;
    }

    if(errorsFields) {
      errorsFields.forEach((error: any) => {
        fields.forEach((field: any) => {
          if (field.attributes.name === error.field) {
            field.error = error.message;
          }
        });
      });
    } else {
      alert.display = true;
      alert.type = 'error';
      alert.message = globalError;

      setTimeout(() => {
        alert.display = false;
      }, 3000);
    }
  }

  async function register(step: number, fields: any, optionalFiles: any) {
    fields.forEach((field: any) => {
      field.error = '';
    });

    const submitButton = fields[fields.length - 1];
    submitButton.loading = 'Chargement...';

    const image = optionalFiles[0];
    const json = optionalFiles[1];
    let jsonFormat: any;
    if(step === 1) {
      jsonFormat = {
        email: formValues.email,
        password: formValues.password,
        password_confirmation: formValues.confirmationPassword,
        pseudo: formValues.pseudo
      };
    } else {
      jsonFormat = {
        email: formValues.email,
        password: formValues.password,
        password_confirmation: formValues.confirmationPassword,
        pseudo: formValues.pseudo,
        guild_name: formValues.guildName
      };
    }

    if(
        image &&
        image.value
    ) {
      jsonFormat = {
        ...jsonFormat,
        image: image.value
      }
    }

    if(
        json &&
        json.value
    ) {
      jsonFormat = {
        ...jsonFormat,
        json: json.value
      }
    }

    const formData = new FormData();
    for (const key in jsonFormat) {
      formData.append(key, jsonFormat[key]);
    }

    const result = await fetch(`${env.VITE_URL}/api/auth/register/${step}`, {
      method: 'POST',
      body: formData,
    });

    const resultJson = await result.json();
    if(
        step === 1 ||
        step === 2
    ) {
      if (result.ok) {
        canIncrement.value = true;
        incrementStep();

        if(step === 2) {
          if(
              image
              && image.value
              && resumeContent
          ) {
            resumeContent[0].image = {
              src: URL.createObjectURL(image.value),
              alt: image.value.name
            };
          }

          if (resumeContent) {
            resumeContent[1].text = formValues.guildName;
            resumeContent[2].text = resultJson.leader;

            if(resultJson.members > 1) {
              resumeContent[3].text = `${resultJson.members} membres`;
            } else if(resultJson.members === 1) {
              resumeContent[3].text = `${resultJson.members} membre (vous)`;
            }
          }
        }

      } else {
        canIncrement.value = false;
        displayError(fields, resultJson);
      }
    } else {
      if (result.ok) {
        await router.push('/login');
      } else {
        displayError(null, resultJson);
      }
    }

    submitButton.loading = '';
  }

  function sendDataForm() {
    if(
        formValues.email !== '' &&
        formValues.pseudo !== '' &&
        formValues.password !== '' &&
        currentStep.value === 1
    ) {
      register(currentStep.value, formFieldsStepOne, [memberImage]);
    } else if(
        formValues.guildName !== '' &&
        currentStep.value === 2
    ) {
      register(currentStep.value, formFieldsStepTwo, [memberImage, json]);
    } else if(
        formValues.email !== '' &&
        formValues.pseudo !== '' &&
        formValues.password !== '' &&
        formValues.guildName !== '' &&
        currentStep.value === 3
    ) {
      register(currentStep.value, formFieldsStepTwo, [memberImage, json])
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
    <h1 class="register__title">Inscription</h1>
    <FormPage
        :steps="steps"
        :currentStep="currentStep"
        @sendValue="updateValue"
        @nextStep="sendDataForm"
    />
    <Alert
        :display="alert.display"
        :type="alert.type"
        :message="alert.message"
    />
  </main>
</template>