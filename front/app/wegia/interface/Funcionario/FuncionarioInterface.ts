import type { PessoaInterface } from "../Pessoa/PessoaInterface";

export interface FuncionarioInterface {
    cargo: string;
    certificado_reservista_numero: string | null;
    certificado_reservista_serie: string | null;
    ctps: string;
    data_admissao: string;
    id_cargo: number;
    id_funcionario: number;
    id_pessoa: number;
    id_situacao: number;
    numero_titulo: string | null;
    pessoa: PessoaInterface;
    pis: string | null;
    secao: string | null;
    situacao: string;
    uf_ctps: string | null;
    zona: string | null;
    perfil: PerfilInterface | null
}