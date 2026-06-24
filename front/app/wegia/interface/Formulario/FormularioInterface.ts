import type { Store } from "pinia"

export interface FormularioInterface {
    nome: string
    label?: string
    placeholder?: string
    opcoes?: Opcoes[]
    storeOpcoes?: StoreOpcoes
    type?: string
    mask?: string | ((valor: string) => string) | null
    regex?: RegExp
    value: string | Array<any> | number | File
    erro: string
    blur?: Function
    validacao?: Function
    tiposAceitos?: String
    tamanho?: number
    formatarParaAdicionarNoForm?: Function
    formatarParaEnviar?: Array<string | RegExp>
    obrigatorio?: boolean
    max?: number
    desabilitado?: boolean
    invisivel?: boolean
}

interface Opcoes {
    value: string | number,
    icon?: string,
    texto?: string
}

export interface StoreOpcoes {
    store: Store<any, any, any, any>,
    action?: string
    stateProp?: string
    abrirModal?: string
}