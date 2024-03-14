interface ILink {
    name: string,
    path: string,
    selected: boolean
}

interface ISubmenuLink {
    icon: string,
    text: string,
    path: string
}

export type {
    ILink,
    ISubmenuLink
}