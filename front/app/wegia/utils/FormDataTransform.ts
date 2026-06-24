import type { CepInterface } from "~/interface/Cep/CepInterface";
import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";

export const criarFormData = (
    formulario: { titulo: string; itens: FormularioInterface[] }[]
  ): FormData => {
    const formData = new FormData();

    formulario.forEach(secao => {
      secao.itens.forEach(campo => {
        if (!campo.nome) return;

        let valor = campo.value;

        if (campo.formatarParaEnviar && typeof valor === "string") {
          const [campo1, campo2] = campo.formatarParaEnviar;
          valor = valor.replace(campo1, campo2);
        }

        if (Array.isArray(valor)) {
          valor.forEach((item, index) => {
            const finalKey = `${campo.nome}[]`;

            if (item instanceof File) {
              formData.append(finalKey, item, item.name);
            } else {
              formData.append(finalKey, item);
            }
          });
        }
        else if (valor instanceof File) {
          formData.append(campo.nome, valor, valor.name);
        }
        else {
          formData.append(campo.nome, String(valor));
        }
      });
    });

    return formData;
  };


export const preencherFormulario = (
  dadosApi: any,
  formulario: { titulo: string; itens: FormularioInterface[] }[]
) => {
  formulario.forEach(section => {
    section.itens.forEach(item => {
      if (dadosApi[item.nome] !== undefined && dadosApi[item.nome] !== null) {
        let valor = dadosApi[item.nome];
        if (item.formatarParaAdicionarNoForm) {
          valor = item.formatarParaAdicionarNoForm(valor);
        }
        item.value = valor;
      }
    });
  });
};

export const preecherFormularioComCep = (endereco: CepInterface, formulario: { titulo: string; itens: FormularioInterface[] }[]) => {

    formulario.forEach(f => {

        f.itens.forEach(item => {

          if (endereco[item.nome] || item.nome == 'cidade') {
            if (item.nome == 'cidade') {
                item.value = endereco.localidade;

            } if (item.nome == 'estado') {
                item.value = endereco.uf;
            }else if (endereco[item.nome]) {
                item.value = endereco[item.nome];

            }
          }

        });

    });
}

export const formDataParaJson = (formData: FormData) => {
    const obj = {};

    formData.forEach((value, key) => {
        obj[key] = value;
    });

    return obj;
}

export const formatFormToJson = (formulario: { titulo: string; itens: FormularioInterface[]}[]) => {
  const json:any = {}

  formulario.forEach(secao => {
    secao.itens.forEach(campo => {
        if(campo.formatarParaEnviar && campo.formatarParaEnviar.length === 2) {
          const [regex, replace] = campo.formatarParaEnviar

          if (typeof campo.value === 'string') {
            json[campo.nome] = campo.value.replace(regex as RegExp, replace as string)
          } else {
            json[campo.nome] = campo.value
          }

        } else {
          json[campo.nome] = campo.value
        }
    });
  })

  return json
}

export const desabilitarCampos = (formulario: { titulo: string; itens: FormularioInterface[]}[], desabilitado = true) => {
    formulario.forEach(secao => {
        secao.itens.forEach(campo => {
            campo.desabilitado = desabilitado
        });
    });
}

export const limparCampos = (formulario: { titulo: string; itens: FormularioInterface[] }[]) => {
    formulario.forEach(section => {
        section.itens.forEach(item => {
            item.value = '';
            item.erro = '';

        });
    });
}

export const setItemDesabilitadoPorNome = (
  formulario: { titulo: string; itens: FormularioInterface[] },
  nome: string,
  desabilitado: boolean
) => {
  const item = formulario.itens.find(i => i.nome === nome);
  if (item) {
    item.desabilitado = desabilitado;
  }
}

export const setErroPorNome = (
  formulario: { titulo: string; itens: FormularioInterface[] },
  nome: string,
  erro: string
) => {
  const item = formulario.itens.find(i => i.nome === nome);
  if (item) {
    item.erro = erro;
  }
}

export const mudandoCampoNoForm = <T extends FormularioInterface, K extends keyof T> (
  formulario: { titulo: string; itens: T[] },
  nome: string,
  campo: K,
  novoNome: T[K]
) => {

  const item = formulario.itens.find(i => i.nome === nome);
  if (item && campo in item) {
    item[campo] = novoNome;
  }

}

export const mudandoCampoNoFormArray = <
  T extends FormularioInterface,
  K extends keyof T
>(
  formularios: readonly { titulo: string; itens: T[] }[],
  nome: string,
  campo: K,
  novoValor: T[K]
) => {
  for (const formulario of formularios) {
    const item = formulario.itens.find(i => i.nome === nome);

    if (item) {
      item[campo] = novoValor;
      return;
    }
  }
};
