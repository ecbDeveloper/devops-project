export interface MenuInterface {
    nome: string,
    icone: string,
    link: string,
    permissao?: string | string[]
    submenu?: MenuInterface[] | []
}