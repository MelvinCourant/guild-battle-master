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
    forms: Array<IForms>;
    resume?: IResume
    footerText?: IFooterText;
    passwordForgotten?: IPasswordForgotten;
}

interface IForms {
    id: number;
    fields: Array<IField>;
}

interface IResume {
    id: number;
    content: Array<IContent>;
    submit: IField;
}

interface IContent {
    type: string;
    image?: IImage;
    text?: string;
}

interface IField {
    label?: string;
    error?: string;
    image?: IImage;
    loading?: boolean;
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
    IResume,
    IContent,
    IField,
    IAttributes,
    IFooterText,
    IPasswordForgotten
};