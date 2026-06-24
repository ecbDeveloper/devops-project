import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";

class ValidateForm {

    obrigatorio(value: any): string {
        if (value === null || value === undefined || value === '') {
            return 'Campo Obrigatório!'
        }

        return ''
    }

    /**
     * Valida um CPF (formato e dígitos verificadores)
     * @param cpf - O CPF a ser validado (com ou sem máscara)
     * @returns string - Retorna vazio caso nao tenha erro e um texto caso tenha erro
     */
    cpfValidacao(cpf: string): string {
        const cpfLimpo = cpf.replace(/\D/g, '');

        if (cpfLimpo.length !== 11 || /^(\d)\1{10}$/.test(cpfLimpo)) {
            return "Cpf precisa ter 11 digitos";
        }

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += Number.parseInt(cpfLimpo.charAt(i)) * (10 - i);
        }
        let restante = (soma * 10) % 11;
        if (restante === 10) restante = 0;

        if (restante !== Number.parseInt(cpfLimpo.charAt(9))) {
            return "Cpf inválido!";
        }

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += Number.parseInt(cpfLimpo.charAt(i)) * (11 - i);
        }
        restante = (soma * 10) % 11;
        if (restante === 10) restante = 0;

        return restante === Number.parseInt(cpfLimpo.charAt(10)) ? "" : "CPF inválido!";
    }

    /**
     * Valida um CNPJ (formato e dígitos verificadores)
     * @param cnpj - O CNPJ a ser validado (com ou sem máscara)
     * @returns string - Retorna vazio ("") se for válido, ou mensagem de erro se for inválido
     */
    cnpjValidacao(cnpj: string): string {
        const cnpjLimpo = cnpj.replace(/\D/g, '');

        if (cnpjLimpo.length !== 14 || /^(\d)\1{13}$/.test(cnpjLimpo)) {
            return "CNPJ precisa ter 14 dígitos válidos.";
        }

        const validarDigito = (base: string, pesoInicial: number): number => {
            let soma = 0;
            let peso = pesoInicial;

            for (let i = 0; i < base.length; i++) {
                soma += Number.parseInt(base.charAt(i)) * peso--;
                if (peso < 2) peso = 9;
            }

            const resto = soma % 11;
            return resto < 2 ? 0 : 11 - resto;
        };

        const base = cnpjLimpo.slice(0, 12);
        const digito1 = validarDigito(base, 5);
        const digito2 = validarDigito(base + digito1, 6);

        const cnpjValido = base + digito1.toString() + digito2.toString();

        return cnpjValido === cnpjLimpo ? "" : "CNPJ inválido!";
    }

    cpfOuCnpjValidacao(valor: string): string {
        const documento = valor.replace(/\D/g, '');

        if (!documento) return "Documento obrigatório.";

        if (documento.length <= 11) {
            return new ValidateForm().cpfValidacao(documento);
        }

        if (documento.length <= 14) {
            return new ValidateForm().cnpjValidacao(documento);
        }

        return "CPF ou CNPJ inválido!";
    }

    /**
     * Valida o tipo de um arquivo com base nos tipos aceitos
     * @param file - O arquivo a ser validado
     * @param tiposAceitos - String com os tipos permitidos separados por '|', ex: "png|jpg|jpeg"
     * @param obrigatorio - Boolean para saber se a imagem eh obrigatoria"
     * @returns string - Retorna vazio se válido, ou uma mensagem de erro
     */
    arquivoValidacao(file: File | null, tiposAceitos: string, obrigatorio: boolean = false): string {
        if (!file && obrigatorio) return "Nenhum arquivo selecionado.";

        if (!file && !obrigatorio) return "";

        const extensoesPermitidas = tiposAceitos.split('|').map(ext => ext.toLowerCase());
        const extensaoArquivo = file?.name.split('.').pop()?.toLowerCase();

        if (!extensaoArquivo || !extensoesPermitidas.includes(extensaoArquivo)) {
            return `Tipo de arquivo inválido. Apenas arquivos: ${tiposAceitos.replace(/\|/g, ', ')} são permitidos.`;
        }

        return "";
    }

    dataValida(value: string) {
        if (!value) return "Data inválida.";
        const partes = value.split('/');
        if (partes.length !== 3) return "Data inválida. Use o formato DD/MM/AAAA.";

        const [diaStr, mesStr, anoStr] = partes;
        const dia = Number.parseInt(diaStr, 10);
        const mes = Number.parseInt(mesStr, 10);
        const ano = Number.parseInt(anoStr, 10);

        if (Number.isNaN(dia) || Number.isNaN(mes) || Number.isNaN(ano)) {
            return "Data inválida. Dia, mês e ano devem ser números.";
        }

        if (ano < 1900 || ano > 2100 || mes < 1 || mes > 12 || dia < 1 || dia > 31) {
            return "Data inválida. Ano deve estar entre 1900 e 2100, mês entre 1 e 12, dia entre 1 e 31.";
        }

        const dataInformada = new Date(ano, mes - 1, dia);

        if (dataInformada.getFullYear() !== ano || dataInformada.getMonth() + 1 !== mes || dataInformada.getDate() !== dia) {
            return "Data inválida. Dia, mês ou ano incorretos.";
        }

        return ''
    }

    /**
     * Valida o Se a data enviada é maior que a de hoje
     * @param value - O value deve ser a string da data no padrao dd/mm/aaaa
     * @returns string - Retorna a mensagem de erro para o usuario
     */
    dataMenorQueHoje(value: string) {
        const valida = new ValidateForm().dataValida(value);

        if (valida.length) return valida;

        const hoje = new Date();

        const dataInformada = new Date(value?.split('/').reverse().join('-'));

        return dataInformada > hoje ? "A data não pode ser maior que hoje!" : "";
    }

    /**
     * Valida se a data e hora enviadas são maiores que a data/hora atual
     * @param value - O value deve ser a string no padrão DD/MM/AAAA HH:MM
     * @returns string - Retorna a mensagem de erro para o usuário
     */
    dataMenorQueHojeComHorario(value: string) {
        const valida = new ValidateForm().dataValida(value.split(' ')[0]);
        if (valida.length) return valida;

        const agora = new Date();

        const [data, hora] = value.split(' ');
        const [dia, mes, ano] = data.split('/').map(Number);
        const [horaNum, minutoNum] = hora.split(':').map(Number);

        if (horaNum < 0 || horaNum > 23 || minutoNum < 0 || minutoNum > 59) {
            return "Hora inválida!";
        }

        const dataInformada = new Date(ano, mes - 1, dia, horaNum, minutoNum, 0);

        return dataInformada > agora ? "A data e hora não podem ser maiores que agora!" : "";
    }

    /**
     * Valida se a data enviada é menor que a de hoje
     * @param value - O value deve ser a string da data no padrão dd/mm/aaaa
     * @returns string - Retorna a mensagem de erro para o usuário
     */
    dataMaiorQueHoje(value: string) {
        const valida = new ValidateForm().dataValida(value);

        if (valida.length) return valida;

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const dataInformada = new Date(value.split('/').reverse().join('-'));
        dataInformada.setHours(0, 0, 0, 0);

        return dataInformada < hoje ? "A data não pode ser menor que hoje!" : "";
    }


    /**
     * Valida o cep por meio da cep ViaCep
     * @param cep - O cep de um endereco deve ser mandado com um padrao valido
     * @returns string - Retorna a mensagem de erro para o usuario
     */
    async cepValido(cep: string) {
        const cepStore = useCepStore()
        let erro = ""

        await cepStore.fetchEndereco(cep).then(() => {
            if(cepStore.getEndereco.erro) {
                erro =  "Cep Inválido"
            }
        }).catch(() => erro =  "Cep Inválido")

        return erro
    }

    validacaoRg(rg: string) {
        const rgLimpo = rg.replace(/[^0-9A-Za-z]/g, "");

        if(/^(\d)\1+$/.test(rgLimpo)) {
            return 'Rg Inválido';
        }
        return ''
    }

    validarPIS(pis: string): String {
        const pisLimpo = pis.replace(/\D/g, '');

        if (pisLimpo.length !== 11) {
            return 'PIS inválido. Deve ter 11 dígitos.';
        }

        const pesos = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

        let soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += Number.parseInt(pisLimpo.charAt(i)) * pesos[i];
        }

        const resto = soma % 11;
        const digitoVerificador = resto === 0 || resto === 1 ? 0 : 11 - resto;

        if (Number.parseInt(pisLimpo.charAt(10)) !== digitoVerificador) {
            return 'PIS inválido. O dígito verificador está incorreto.';
        }

        return '';
    }

    validarCTPS(ctps: string) : String {
        const ctpsLimpo = ctps.replace(/[^0-9A-Za-z]/g, "");

        if(/^(\d)\1+$/.test(ctpsLimpo)) {
            return 'CTPS Inválido.';
        }

        if(ctpsLimpo.length != 11) {
            return 'CTPS Inválido. Precisa conter 11 digitos.'
        }
        return ''
    }

    validarTituloEleitor(titulo: string) : String {
        const tituloLimpo = titulo.replace(/[^0-9A-Za-z]/g, "");

        if(tituloLimpo.length != 12) {
            return 'Titulo Inválido. Precisa conter 12 digitos.'
        }

        return ''
    }

    estaVazio = (value: any) => {
        if (value === null || value === undefined) return true
        if (typeof value === 'string' && value.trim() === '') return true
        return false
    }


    /**
     * Valida o Formulario com um padrao de objeto enviado
     * @param array - O array de objetos deve ser mandado com um padrao valido
     * @returns boolena - Retorna true caso o envio nao tenha nenhum erro
     */
    async validate(array: { titulo: string; itens: FormularioInterface[] }[]) : Promise<Boolean> {
        let tudoCerto = true

        for (const a of array) {
            for (const obj of a.itens) {
                obj.erro = '';

                if (obj.obrigatorio && this.estaVazio(obj.value)) {
                    obj.erro = "Campo Obrigatório!";
                }

                if(!obj.obrigatorio && this.estaVazio(obj.value)) break

                if (!obj.erro && obj.validacao) {
                    obj.erro = await obj.validacao(obj.value);
                }

                if (!obj.erro && obj.type === 'file' && obj.value) {
                    const arquivos = obj.value instanceof FileList ? Array.from(obj.value) : [obj.value];

                    for (const arquivo of arquivos) {
                        if (obj.tiposAceitos) {
                            const extensoesPermitidas = obj.tiposAceitos.split('|').map(ext => ext.toLowerCase());
                            const extensaoArquivo = arquivo.name.split('.').pop()?.toLowerCase();

                            if (!extensaoArquivo || !extensoesPermitidas.includes(extensaoArquivo)) {
                                obj.erro = `Tipo de arquivo inválido. Apenas arquivos: ${obj.tiposAceitos.replace(/\|/g, ', ')} são permitidos.`;
                                break;
                            }
                        }

                        if (obj.tamanho && arquivo.size > obj.tamanho) {
                            obj.erro = `Arquivo muito grande. Tamanho máximo permitido: ${obj.tamanho / (1024*1024)} MB.`;
                            break;
                        }
                    }
                }

                if (obj.erro.length > 0) {
                    tudoCerto = false;
                }
            }
        }

        return tudoCerto
    }

    /**
     * Valida um CID-10
     * @param cid - String do CID
     * @returns string - Retorna vazio se válido, ou mensagem de erro
     */
    cidValido(cid: string): string {
        const regex = /^[A-Z][0-9]{2}(\.[0-9]{1,2})?$/;

        return regex.test(cid.toUpperCase()) ? "" : "CID inválido!";
    }

    /**
    * Valida um e-mail
    * @param email - String do email
    * @returns string - Retorna vazio se válido, ou mensagem de erro se inválido
    */
    emailValido(email: string): string {
        if (!email) return "Email obrigatório.";

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regex.test(email)) {
            return "Email inválido.";
        }

        return '';
    }

    /**
     * Valida telefone brasileiro (fixo ou celular)
     * @param telefone - Telefone com ou sem máscara
     * @returns string - Vazio se válido ou mensagem de erro
     */
    telefoneValido(telefone: string): string {
        if (!telefone) return "Telefone obrigatório.";

        const telLimpo = telefone.replace(/\D/g, '');

        if (telLimpo.length !== 10 && telLimpo.length !== 11) {
            return "Telefone inválido.";
        }
        if (!/^[1-9]{2}/.test(telLimpo)) {
            return "DDD inválido.";
        }

        if (telLimpo.length === 11 && telLimpo.charAt(2) !== '9') {
            return "Celular inválido.";
        }

        return '';
    }

    validarCampoComRegras = ({
        valor,
        regras,
        mensagens = {}
    }: {
        valor: string,
        regras?: ContribuicaoRegraMeioPagamentoInterface[] | null,
        mensagens?: Partial<Record<string, string>>
    }) => {

        if (!regras || regras.length === 0) {
            return { valido: true }
        }

        if (!valor) {
            return {
                valido: false,
                mensagem: mensagens.OBRIGATORIO ?? 'Campo obrigatório.'
            }
        }

        const valorNumerico = parseFloat(
            valor.replace(/[^\d,]/g, '').replace(',', '.')
        )

        if (valorNumerico === null || isNaN(valorNumerico)) {
            return {
                valido: false,
                mensagem: mensagens.INVALIDO ?? 'Valor inválido.'
            }
        }

        for (const regraWrapper of regras) {
            const regra = regraWrapper?.regra?.regra
            const limite = Number(regraWrapper.valor)

            if (isNaN(limite)) continue

            switch (regra) {
            case 'MIN_VALUE':
                if (valorNumerico < limite) {
                    return {
                        valido: false,
                        mensagem:
                        mensagens.MIN_VALUE ??
                        `O valor mínimo permitido é ${limite}`
                    }
                }
                break

            case 'MAX_VALUE':
                if (valorNumerico > limite) {
                    return {
                        valido: false,
                        mensagem:
                        mensagens.MAX_VALUE ??
                        `O valor máximo permitido é ${limite}`
                    }
                }
                break
            }
        }

        return { valido: true }
    }

}

export default new ValidateForm()