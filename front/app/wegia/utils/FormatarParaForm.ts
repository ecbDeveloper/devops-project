class FormatarParaForm {
    formatarCpf(cpf: string): string {
        const cpfLimpo = cpf.replace(/\D/g, '');

        if (cpfLimpo.length !== 11) {
            return cpf;
        }

        return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    formatarCnpj(cnpj: string): string {
        const cnpjLimpo = cnpj.replace(/\D/g, '');

        if (cnpjLimpo.length !== 14) {
            return cnpj;
        }

        return cnpjLimpo.replace(
            /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
            '$1.$2.$3/$4-$5'
        );
    }

    formatarCpfOuCnpj(valor: string) {

        const valorLimpo = valor.replace(/\D/g, '');

        if(valor.length > 11) {
            return this.formatarCnpj(valor)
        }

        return this.formatarCpf(valor)

    }

    formatarRg(rg: string): string {
        const rgLimpo = rg.replace(/\D/g, '');

        if (rgLimpo.length !== 9) {
            return rg;
        }

        return rgLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    }

    formatarCep(cep: string): string {
        const cepLimpo = cep.replace(/\D/g, '');

        if (cepLimpo.length !== 8) {
            return cep;
        }

        return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
    }

    formatarTelefone(telefone: string): string {
        const telefoneLimpo = telefone.replace(/\D/g, '');

        if (telefoneLimpo.length !== 11) {
            return telefone;
        }

        return telefoneLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    formatarPIS(pis: string) {
        const pisLimpo = pis.replace(/\D/g, '');

        if (pisLimpo.length !== 11) {
            return pisLimpo;
        }

        return pisLimpo.replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, '$1.$2.$3-$4');
    }

    formatarCTPS(ctps: string) {
        const ctpsLimpo = ctps.replace(/\D/g, '');

        if (ctpsLimpo.length !== 11) {
            return ctpsLimpo;
        }

        return ctpsLimpo.replace(/(\d{7})(\d{4})/, '$1/$2');
    }

    formatarDinheiro(valor: string): string {
        return valor.replace('.', ',');
    }

    formatarDataParaBR(data: string): string {
        if (!data) return '';

        const [ano, mes, dia] = data.split('-');
        if (!ano || !mes || !dia) return data;

        return `${dia}/${mes}/${ano}`;
    }
}

export default new FormatarParaForm()