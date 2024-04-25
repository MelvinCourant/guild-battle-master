<script setup>
  import "../assets/css/views/_login-register.scss";
  import FormPage from "../components/FormPage.vue";
  import Alert from "../components/utils/Alert.vue";
  import { reactive, ref, provide } from "vue";
  import { useRouter } from "vue-router";

  const env = import.meta.env;
  const router = useRouter();

  function generateImgSrc(src) {
    return new URL(`../assets/imgs/${src}`, import.meta.url).href;
  }

  const placeholderImage = generateImgSrc('placeholder.jpg');
  const leaderImage = generateImgSrc('roles/leader.svg');
  const membersImage = generateImgSrc('members.svg');
  const steps = [
      {
        level: 1,
        label: 'Compte',
        active: true,
      },
      {
        level: 2,
        label: 'JSON',
        active: false,
      },
      {
        level: 3,
        label: 'Résumé',
        active: false,
      },
  ];
  const registerForm = reactive({
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
            label: 'Nom d\'utilisateur*',
            attributes: {
              type: 'text',
              name: 'username',
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
          type: 'submit',
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
  const alert = reactive({
    display: false,
    message: '',
  });
  const currentStep = ref(1);
  const formValues = reactive({
    email: '',
    password: '',
    confirmationPassword: '',
    username: '',
    json: null,
  });
  const memberImage = ref();
  const formStepOne = registerForm.forms[0];
  const formFieldsStepOne = formStepOne.fields;
  const formStepTwo = registerForm.forms[1];
  const formFieldsStepTwo = formStepTwo.fields;
  const resume = registerForm.resume;
  const resumeContent = resume.content;
  const canIncrement = ref(false);

  provide('formContainer', registerForm);

  function updateValue(inputName, value) {
    if(inputName === 'image') {
      memberImage.value = value;
    } else if(inputName === 'email') {
      formValues.email = value;
    } else if(inputName === 'username') {
      formValues.username = value;
    } else if(inputName === 'password') {
      formValues.password = value;
    } else if(inputName === 'confirmationPassword') {
      formValues.confirmationPassword = value;
    } else if(inputName === 'json') {
      formValues.json = value;
    }
  }

  function displayError(fields, resultJson) {
    let errorsFields;
    let globalError;

    if(resultJson.errors) {
      errorsFields = resultJson.errors;
    } else {
      globalError = resultJson.message;
    }

    if(errorsFields) {
      errorsFields.forEach((error) => {
        fields.forEach((field) => {
          if (field.attributes.name === error.field) {
            field.error = error.message;
          }
        });
      });
    } else {
      alert.display = true;
      alert.type = 'error';
      alert.message = globalError;
    }
  }

  async function register(step, fields, optionalFiles) {
    fields.forEach((field) => {
      field.error = '';
    });

    const submitButton = fields[fields.length - 1];
    submitButton.loading = 'Chargement...';

    const image = optionalFiles[0];
    let jsonFormat;
    if(step === 1) {
      jsonFormat = {
        email: formValues.email,
        password: formValues.password,
        password_confirmation: formValues.confirmationPassword,
        username: formValues.username
      };
    } else {
      jsonFormat = {
        email: formValues.email,
        password: formValues.password,
        password_confirmation: formValues.confirmationPassword,
        username: formValues.username,
        json: formValues.json
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
            resumeContent[1].text = resultJson.guildName;
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

  async function sendDataForm() {
    if(
        formValues.email !== '' &&
        formValues.username !== '' &&
        formValues.password !== '' &&
        currentStep.value === 1
    ) {
      await register(currentStep.value, formFieldsStepOne, [memberImage]);
    } else if(
        formValues.json &&
        currentStep.value === 2
    ) {
      await register(currentStep.value, formFieldsStepTwo, [memberImage]);
    } else if(
        formValues.email !== '' &&
        formValues.username !== '' &&
        formValues.password !== '' &&
        formValues.json &&
        currentStep.value === 3
    ) {
      await register(currentStep.value, formFieldsStepTwo, [memberImage])
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