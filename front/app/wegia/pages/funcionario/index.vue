<template>
        <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_FUNCIONARIO)">Você não possui permissão!</h2>
        <section class="funcionario" v-else>

            <ListaDeDados
                titulo="Funcionarios"
                class="lista-de-funcionario"
            >
                <FiltroFuncionario
                    :itensPorPaginaArray="itensPorPaginaArray"
                    :itensPorPagina="itensPorPagina"
                    :busca="buscar"
                    :orderByArray="cabecalho"
                    :orderBy="orderBy"
                    :tipoOrderBy="tipoOrderBy"
                    :situacaoArray="situacoes"
                    :situacao="situacao"
                    @atualizar-filtros="atualizarFiltrosMobile"
                    class="filtro-mobile"
                />

                <div class="filtros">

                    <InputSelect
                        v-model="situacao"
                        :opcoes="situacoes"
                        @select-change="buscarFuncionarios"
                    />

                    <div class="filtro-busca">
                        <InputText
                            v-model="buscar"
                            placeholder="Search"
                        />
                        <Butao texto="Filtrar" @click-botao="buscarFuncionarios" />
                    </div>
                </div>

                <Loading v-if="isLoading" />

                <Tabela
                    v-else
                    :cabecalhos="cabecalho"
                    :linhas="funcionarios"
                    :orderBy="orderBy"
                    :tipoOrderBy="tipoOrderBy"
                    @atualizar-orderBy="atualizarOrderBy"
                    @click-linha="navegarParaFuncionario"
                />

                <div class="paginacao">
                    <p>{{ paginacaoTexto }}</p>

                    <div class="paginador">
                        <Paginador
                            :paginaAtual=paginaAtual
                            :ultimaPagina=ultimaPagina
                            @atualizar-pagina="atualizarPaginaAtual"
                        />
                    </div>

                    <div class="select-itens">
                        <InputSelect
                            @select-change="buscarFuncionarios"
                            v-model="itensPorPagina"
                            :opcoes="itensPorPaginaArray"
                        />
                        <span>Itens Por Página</span>
                    </div>
                </div>
            </ListaDeDados>

        </section>
</template>

<script setup lang="ts">

import type { FuncionarioPaginacaoInterface } from '~/interface/Funcionario/FuncionarioPaginacaoInterface';

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_FUNCIONARIO
})


const router = useRouter();
const menuSectionStore = useMenuSectionStore()
const funcionarioStore = useFuncionarioStore()
const situacaoStore = useSituacaoStore()
const pessoaStore = usePessoaStore()

const itensPorPaginaArray = ref([
    {texto: '10', value: 10},
    {texto: '25', value: 25},
    {texto: '50', value: 50},
    {texto: '100', value: 100},
])

const cabecalho = ref([
    {nome: 'Nome', chave: 'nome', ordenavel: true},
    {nome: 'CPF', chave: 'cpf', ordenavel: true},
    {nome: 'Cargo', chave: 'cargo', ordenavel: true}
])

const itensPorPagina = ref(10)
const situacao = ref(1)
const paginaAtual = ref(1)
const ultimaPagina = ref(1)
const totalItens = ref(0)
const buscar = ref('')
const orderBy = ref('')
const tipoOrderBy = ref('')
const isLoading = ref(true)

const situacoes = computed(() => situacaoStore.getSituacaoParaSelect)

const funcionarios = computed(() => {
    const f = funcionarioStore.getFuncionarioPaginacao

    if(!f?.items?.length || isLoading.value) return []

    return f.items.map(funcionario => {
        return {
            id_funcionario: funcionario.id_funcionario,
            cpf: funcionario.pessoa.cpf,
            nome: funcionario.pessoa.nome,
            cargo: funcionario?.perfil?.cargo
        }
    })
})

menuSectionStore.setTitulo("Informações")
menuSectionStore.setComplemento("Digite seu CPF")

onMounted(async () => {
    await buscarFuncionarios()

    await situacaoStore.fetchSituacao()
})

const atualiazarPaginadorCompleto = (f: FuncionarioPaginacaoInterface) => {
    paginaAtual.value = f.paginaAtual
    itensPorPagina.value = f.itensPorPagina
    ultimaPagina.value = f.totalPaginas
    totalItens.value = f.totalItens
}

const buscarFuncionarios = async () => {

    isLoading.value = true

    await funcionarioStore.fetchFuncionarios(
        {
            id_situacao: situacao.value,
            buscar:  buscar.value,
            itensPorPagina: itensPorPagina.value,
            pagina: paginaAtual.value,
            ordenacao: orderBy.value,
            tipoOrdenacao: tipoOrderBy.value
        }
    ).then(response => {
        const f = funcionarioStore.getFuncionarioPaginacao
        atualiazarPaginadorCompleto(f)
    })

    isLoading.value = false
}

const paginacaoTexto = computed(() => {
    const total = totalItens.value || 0;
    const inicio = (paginaAtual.value - 1) * itensPorPagina.value + 1;
    const fim = Math.min(paginaAtual.value * itensPorPagina.value, total);
    return `Showing ${inicio} to ${fim} of ${total} entries`;
});

const atualizarOrderBy = async (value : {orderBy: string, tipoOrderBy: string}) => {
    orderBy.value = value.orderBy
    tipoOrderBy.value = value.tipoOrderBy
    await buscarFuncionarios()
}

const atualizarPaginaAtual = async (novaPagina: number) => {
    if(novaPagina !== paginaAtual.value) {
        paginaAtual.value = novaPagina;
        await buscarFuncionarios()
    }
};

const navegarParaFuncionario = (value : {id_funcionario: number}) => {
    const funcionario = funcionarioStore.getFuncionarioPaginacao.items.find(f => {
        return f.id_funcionario == value.id_funcionario
    })

    if(funcionario) {
        funcionarioStore.setFuncionario(funcionario)
    }
    router.push(`/funcionario/${value.id_funcionario}`)
}

const atualizarFiltrosMobile = async (filtros: any) => {
    situacao.value = filtros.situacao
    buscar.value = filtros.busca
    itensPorPagina.value = filtros.itensPorPagina
    orderBy.value = filtros.orderBy
    tipoOrderBy.value = filtros.tipoOrderBy

    await buscarFuncionarios()
}

</script>

<style scoped lang="scss">

.funcionario {
    padding: 48px;

    .lista-de-funcionario {

        .filtro-mobile {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 24px;

            @include md {
                display: none;
            }
        }

        .filtros {
            display: none;
            justify-content: space-between;
            margin-bottom: 8px;

            @include md {
                display: flex;
            }

            .filtro-busca {
                align-items: center;
                display: flex;
                gap: 8px;

                button {
                    width: 90px;
                    height: 48px;
                }
            }

            .input {
                margin-bottom: 0px;
            }

            .input-select {
                margin-bottom: 0px;
            }

            input {
                width: 25%;
            }
        }

        .paginacao {
            display: grid;
            margin-top: 24px;

            @include md {
                grid-template-columns: 1fr 1fr 1fr;
            }

            p {
                display: none;

                @include md {
                    display: block;
                }
            }

            .paginador {
                margin: 0 auto;
            }

            .select-itens {
                display: none;
                justify-self: end;

                @include md {
                    display: block;
                }
            }
        }
    }
}

</style>