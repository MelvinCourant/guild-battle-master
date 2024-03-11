interface IStep {
    level: number;
    label: string;
    active: boolean;
}

interface IImage {
    src: string;
    alt: string;
}

interface IFormContainer {
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
    attributes: IAttributes;
}

interface IAttributes {
    type: string;
    name: string;
    placeholder?: string;
    value?: string;
    checked?: boolean;
    disabled?: boolean;
    required?: boolean;
    accept?: string;
    autocomplete?: string;
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
    IStep,
    IImage,
    IFormContainer,
    IForms,
    IField,
    IAttributes,
    IFooterText,
    IPasswordForgotten
};