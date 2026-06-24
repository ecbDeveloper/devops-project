<template>
    <div class="section-box-pages">
        <span @click="voltarLista" class="voltar" :class="{'voltar-aparecer': historico.length}">
            <i class="fa fa-arrow-left"></i> Voltar
        </span>

        <Transition name="slide-fade" mode="out-in">
            <div class="section-box" v-if="itensLocal?.length" :key="JSON.stringify(itensLocal)">
                <Box
                    v-for="item in itensLocal"
                    :key="item.nome"
                    :icone="item?.icone"
                    :texto="item?.nome"
                    @click="() => boxClicada(item)"
                />
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">

import type { MenuInterface } from '~/interface/Menu/MenuInterface';

const props = defineProps({
    itens: Array<MenuInterface>
});

const itensLocal = ref<MenuInterface[]>(props.itens || []);
const historico = ref<MenuInterface[][]>([]);
const router = useRouter();

const boxClicada = (item: MenuInterface) => {

    if(item.link) {
        router.push(item.link)
        return 
    }

    if (item.submenu?.length) {
        historico.value.push([...itensLocal.value]); 
        itensLocal.value = item.submenu;
    }
};

const voltarLista = () => {
    if (historico.value.length) {
        itensLocal.value = historico.value.pop() || [];
    }
};
</script>

<style scoped lang="scss">

.slide-fade-enter-active, .slide-fade-leave-active {
    transition: all 0.4s ease;
}

.slide-fade-enter-from {
    opacity: 0;
    transform: translateY(-20px);
}

.slide-fade-leave-to {
    opacity: 0;
    transform: translateY(0px);
}

.section-box-pages {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 48px;

    .voltar {
        visibility: hidden;
        color: $color-octonary;
        cursor: pointer;
        font-size: 24px;
        min-height: 36px;
    }

    .voltar.voltar-aparecer {
        visibility: visible
    }

    .section-box {
        display: flex;
        flex-wrap: wrap;
        gap: 24px;
        justify-content: center;

        @include sm {
            justify-content: inherit;
        }
    }
}
</style>
