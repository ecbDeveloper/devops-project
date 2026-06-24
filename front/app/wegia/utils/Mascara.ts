class Mascara {

  static aplicar(valor: string, mask: string | ((v: string) => string)) {
    if (!valor) return '';

    if (typeof mask === 'function') {
      return mask(valor);
    }

    let valorFormatado = '';
    let i = 0;

    for (const char of mask) {
      if (i >= valor.length) break;

      if (char === '#') {
        valorFormatado += valor[i];
        i++;
      } else {
        valorFormatado += char;
      }
    }

    return valorFormatado;
  }

  static cpfCnpj(valor: string) {
    const apenasNumeros = valor.replace(/\D/g, '');

    if (apenasNumeros.length <= 11) {
      return Mascara.aplicar(apenasNumeros, '###.###.###-##');
    }

    return Mascara.aplicar(apenasNumeros, '##.###.###/####-##');
  }

  static cpf(valor: string) {
    return Mascara.aplicar(valor.replace(/\D/g, ''), '###.###.###-##');
  }

  static cnpj(valor: string) {
    return Mascara.aplicar(valor.replace(/\D/g, ''), '##.###.###/####-##');
  }

  static dinheiro(valor: string, casasDecimais: number = 2) {
    if (!valor) return '';

    const numeros = valor.replace(/\D/g, '');

    if (!numeros) return '';

    const numero = Number(numeros) / Math.pow(10, casasDecimais);

    return numero.toLocaleString('pt-BR', {
      minimumFractionDigits: casasDecimais,
      maximumFractionDigits: casasDecimais
    });
  }

  static data(valor: string, valorAnterior: string = '') {
    const apenasNumeros = valor.replace(/\D/g, '');
    const numerosAnteriores = valorAnterior.replace(/\D/g, '');

    if (!apenasNumeros) return '';

    if (apenasNumeros.length < numerosAnteriores.length) {
      return Mascara.aplicar(apenasNumeros, '##/##/####');
    }

    let numerosValidos = '';

    for (let i = 0; i < apenasNumeros.length && i < 8; i++) {
      const testeNumeros = numerosValidos + apenasNumeros[i];

      if (i === 0) {

        if (parseInt(apenasNumeros[i]) > 3) break;
        numerosValidos += apenasNumeros[i];
      } else if (i === 1) {

        const dia = parseInt(testeNumeros.slice(0, 2));
        if (dia === 0 || dia > 31) break;
        numerosValidos += apenasNumeros[i];
      } else if (i === 2) {

        if (parseInt(apenasNumeros[i]) > 1) break;
        numerosValidos += apenasNumeros[i];
      } else if (i === 3) {

        const mes = parseInt(testeNumeros.slice(2, 4));
        if (mes === 0 || mes > 12) break;
        numerosValidos += apenasNumeros[i];
      } else if (i >= 4 && i < 8) {

        numerosValidos += apenasNumeros[i];
      }
    }

    if (numerosValidos.length === 8) {
      const dia = parseInt(numerosValidos.slice(0, 2));
      const mes = parseInt(numerosValidos.slice(2, 4));
      const ano = parseInt(numerosValidos.slice(4, 8));

      const data = new Date(ano, mes - 1, dia);

      const dataValida =
        data.getFullYear() === ano &&
        data.getMonth() === mes - 1 &&
        data.getDate() === dia;

      if (!dataValida) {
        numerosValidos = numerosValidos.slice(0, 7);
      }
    }

    return Mascara.aplicar(numerosValidos, '##/##/####');
  }

  static vencimentoCartao(valor: string, valorAnterior: string = '') {
    const apenasNumeros = valor.replace(/\D/g, '');
    const numerosAnteriores = valorAnterior.replace(/\D/g, '');

    if (!apenasNumeros) return '';

    if (apenasNumeros.length < numerosAnteriores.length) {
      return Mascara.aplicar(apenasNumeros, '##/##');
    }

    let numerosValidos = '';
    const hoje = new Date();
    const anoAtual = hoje.getFullYear() % 100;
    const mesAtual = hoje.getMonth() + 1;

    for (let i = 0; i < apenasNumeros.length && i < 4; i++) {
      const digito = apenasNumeros[i];

      if (i === 0) {
        if (parseInt(digito) > 1) break;
        numerosValidos += digito;
      }
      else if (i === 1) {
        const mes = parseInt(numerosValidos + digito);
        if (mes === 0 || mes > 12) break;
        numerosValidos += digito;
      }

      else if (i === 2) {
        numerosValidos += digito;
      }
      else if (i === 3) {
        const anoDigitado = parseInt(numerosValidos.slice(2, 3) + digito);

        if (anoDigitado < anoAtual) break;

        if (anoDigitado === anoAtual) {
          const mesDigitado = parseInt(numerosValidos.slice(0, 2));
          if (mesDigitado < mesAtual) break;
        }

        numerosValidos += digito;
      }
    }

    return Mascara.aplicar(numerosValidos, '##/##');
  }
}

export default Mascara;