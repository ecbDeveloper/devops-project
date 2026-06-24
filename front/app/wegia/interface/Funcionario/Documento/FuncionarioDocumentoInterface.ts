export interface FuncionarioDocumentoInterface {
    arquivo: string;
    data: string;
    descricao_docfuncional: string | null;
    extensao_arquivo: string;
    id_docfuncional: number;
    id_funcionario: number;
    id_fundocs: number;
    nome_arquivo: string;
    nome_docfuncional: string;
}