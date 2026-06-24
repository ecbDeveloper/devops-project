<template>

  <modal @fechar-modal="emit('fechar-modal')" class="modal-relatorio-socio">
      <h2>Relatório de Sócios</h2>
      <p><strong> Sócios:</strong> {{ params.tipo_socio ? params.tipo_socio :  'Todas as Opções' }} </p>
      <p><strong> Pessoas:</strong> {{ pessoas }} </p>
      <p><strong> Quantidade:</strong> {{ pessoas.length }} </p>
      <p><strong> Valor:</strong> {{ valorFiltro }} </p>

      <tabela
        class="tabela"
        :cabecalhos="[
          { nome: 'Nome', chave: 'nome', ordenavel: false },
          { nome: 'CPF/CNPJ', chave: 'cpfCnpj', ordenavel: false },
          { nome: 'Telefone', chave: 'telefone', ordenavel: false },
          { nome: 'Email', chave: 'email', ordenavel: false },
          { nome: 'Tipo Sócio', chave: 'tipoSocio', ordenavel: false },
          { nome: 'TAG', chave: 'socioTag', ordenavel: false },
          { nome: 'Valor/Período', chave: 'valor_periodo', ordenavel: false },
          { nome: 'Status', chave: 'socioStatus', ordenavel: false }
        ]"
        :linhas="relatorio"
      />
  </modal>
</template>

<script setup lang="ts">

const props = defineProps<{
  almoxarifado?: string | null
  params: Partial<SocioRelatorioInterface>
}>()

const emit = defineEmits(['fechar-modal'])

const socioStore = useSocioStore()

const pessoas = computed(() => {

  if(props.params.tipo_pessoa === 'f') {
    return 'Fisicas'
  } else if(props.params.tipo_pessoa === 'j') {
    return 'Jurídicas'
  }

  return 'Todas as Opções'

})

const valorFiltro = computed(() => {

  const valores = {
    'maior': 'Maior que',
    'maior_igual': 'Maior ou igual a',
    'igual': 'Igual a',
    'menor': 'Menor que',
    'menor_igual': 'Menor ou igual a',
  }

  const filtro = props.params.valor_filtro

  if(filtro && filtro in valores) return `${valores[filtro as keyof typeof valores]} R$ ${props.params.valor?.replace('.', ',')}`

  return 'Sem Filtro'

})

const relatorio = computed(() => {
  const s = socioStore.getSociosRelatorio

  if(!s.length) return []

  return s.map(so => {
    return {
      ...so,
      nome: so.pessoa.nome,
      cpfCnpj: FormatarParaForm.formatarCpfOuCnpj(so.pessoa.cpf),
      telefone: so.pessoa.telefone,
      tipoSocio: so.tipo.tipo,
      socioTag: so.tag.tag,
      socioStatus: so.status.status
    }
  })
})

</script>

<style lang="scss">

.modal-relatorio-socio {
  &>.modal {
    height: calc(100% - 48px);
    width: calc(100% - 48px);

    h3 {
      margin-bottom: 12px;
    }

    p {
      margin-bottom: 0px;
    }

    .tabela {
      margin-top: 24px;
    }
  }

}

</style>