interface IFormPage {
    steps?: ISteps;
    image?: IImage;
    form: IForm;
}

interface ISteps {
    level: number;
    label: string;
    active: boolean;
}

interface IImage {
    src: string;
    alt: string;
}

interface IForm {
    title?: string;
    fields: [IField];
    footerText?: IFooterText;
    passwordForgotten?: IPasswordForgotten;
}

interface IField {
    label?: string;
    error?: string;
    image?: IImage;
    input: IInput;
}

interface IInput {
    type: string;
    placeholder?: string;
    value?: string;
    checked?: boolean;
    disabled?: boolean;
    required?: boolean;
    style?: string;
}

interface IFooterText {
    text?: string;
    link: string;
    href: string;
}

interface IPasswordForgotten {
    text: string;
    href: string;
}

export type {
    IFormPage,
    ISteps,
    IImage,
    IForm,
    IField,
    IInput,
    IFooterText,
    IPasswordForgotten
};