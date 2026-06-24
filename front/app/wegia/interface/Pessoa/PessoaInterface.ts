import type { FuncionarioInterface } from "../Funcionario/FuncionarioInterface";
import type { AvisoInterface } from "./Aviso/AvisoInterface"

export interface PessoaInterface {
    adm_configurado: number;
    bairro: string;
    cep: string;
    cidade: string;
    complemento: string | null;
    cpf: string;
    data_expedicao: string;
    data_nascimento: string;
    estado: string;
    ibge: string | null;
    id_pessoa: number;
    imagem: string | null;
    logradouro: string;
    nivel_acesso: number;
    nome: string;
    nome_mae: string;
    nome_pai: string;
    numero_endereco: string;
    orgao_emissor: string;
    registro_geral: string;
    sexo: string;
    sobrenome: string;
    telefone: string;
    tipo_sanguineo: string;
    arquivos: PessoaArquivoInterface[] | null;
    funcionario: FuncionarioInterface | null;
    avisos: AvisoInterface[] | null
}