interface IFormPage {
    image?: IImage;
    form: IForm;
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
    IImage,
    IForm,
    IField,
    IInput,
    IFooterText,
    IPasswordForgotten
};