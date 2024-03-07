interface IFormPage {
    image?: {
        src: string;
        alt: string;
    };
    form: IForm;
}

interface IForm {
    title?: string;
    fields: [IField];
    footerText?: IFooterText;
    passwordForgotten?: IPasswordForgotten;
}

interface IField {
    type: string;
    label?: string;
    placeholder?: string;
    value?: string;
    checked?: boolean;
    disabled?: boolean;
    style?: string;
    required?: boolean;
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

export type { IFormPage, IForm, IField, IFooterText, IPasswordForgotten };