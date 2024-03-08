interface IFormPage {
    image?: IImage;
    formContainer: IForm;
}

interface IStep {
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
    forms: IForms
    footerText?: IFooterText;
    passwordForgotten?: IPasswordForgotten;
}

interface IForms {
    id: number;
    fields: IField;
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
    accept?: string;
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
    IStep,
    IImage,
    IForm,
    IForms,
    IField,
    IInput,
    IFooterText,
    IPasswordForgotten
};