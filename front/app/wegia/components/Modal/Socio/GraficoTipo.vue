<template>
  <Modal @fechar-modal="emit('fechar-modal')" class="modal-socio-grafico-tipo">
    <section class="grafico-container">
      <h3 class="titulo">Tipologia dos Sócios</h3>

      <div class="conteudo">
        <div class="grafico-wrapper">
          <svg viewBox="0 0 300 300" class="grafico-pizza">
            <g v-for="(fatia, index) in fatias" :key="index">
              <path
                :d="fatia.caminho"
                :class="['fatia', `fatia-${index}`, { 'fatia-hover': indiceHover === index, 'fatia-dim': indiceHover !== null && indiceHover !== index }]"
                @mouseenter="indiceHover = index"
                @mouseleave="indiceHover = null"
              />
              <text
                v-if="Number(fatia.porcentagem) > 5"
                :x="fatia.labelX"
                :y="fatia.labelY"
                text-anchor="middle"
                dominant-baseline="middle"
                class="label-percentual"
              >
                {{ fatia.porcentagem }}%
              </text>
            </g>
          </svg>
        </div>

        <div class="legenda-wrapper">
          <div class="legenda">
            <div
              v-for="(fatia, index) in fatias"
              :key="index"
              class="legenda-item"
              :class="{ 'legenda-hover': indiceHover === index }"
              @mouseenter="indiceHover = index"
              @mouseleave="indiceHover = null"
            >
              <span class="legenda-cor" :class="`cor-${index}`"></span>
              <div class="legenda-info">
                <div class="legenda-tipo">Socio {{ fatia.tipo }}</div>
                <div class="legenda-dados">{{ fatia.total_socios }} sócios ({{ fatia.porcentagem }}%)</div>
              </div>
            </div>
          </div>

          <div class="total-card">
            <div class="total-label">Total de Sócios</div>
            <div class="total-valor">{{ totalSocios }}</div>
          </div>
        </div>
      </div>
    </section>
  </Modal>
</template>

<script setup lang="ts">
const emit = defineEmits(['fechar-modal'])

const socioStore = useSocioStore()

const estatisticas = computed(() => socioStore.getSociosGraficosTipos)
const indiceHover = ref<number | null>(null)

const totalSocios = computed(() => {
  return estatisticas.value.reduce((soma, item) => soma + item.total_socios, 0)
})

const calcularCoordenadas = (angulo: number) => {
  const radianos = (angulo * Math.PI) / 180
  return {
    x: 150 + 100 * Math.cos(radianos),
    y: 150 + 100 * Math.sin(radianos)
  }
}

const criarCaminho = (anguloInicial: number, anguloFinal: number) => {
  const inicio = calcularCoordenadas(anguloInicial)
  const fim = calcularCoordenadas(anguloFinal)
  const arcoGrande = anguloFinal - anguloInicial > 180 ? 1 : 0

  return `M 150 150 L ${inicio.x} ${inicio.y} A 100 100 0 ${arcoGrande} 1 ${fim.x} ${fim.y} Z`
}

const fatias = computed(() => {
  const total = totalSocios.value
  if (total === 0) return []

  let anguloAtual = -90

  return estatisticas.value.map((item, index) => {
    const porcentagem = (item.total_socios / total) * 100
    const angulo = (porcentagem / 100) * 360
    const anguloInicial = anguloAtual
    const anguloFinal = anguloAtual + angulo
    const caminho = criarCaminho(anguloInicial, anguloFinal)

    const anguloMedio = anguloInicial + angulo / 2
    const labelX = 150 + 70 * Math.cos((anguloMedio * Math.PI) / 180)
    const labelY = 150 + 70 * Math.sin((anguloMedio * Math.PI) / 180)

    anguloAtual = anguloFinal

    return {
      caminho,
      porcentagem: porcentagem.toFixed(1),
      labelX,
      labelY,
      tipo: item.tipo_intermediario,
      total_socios: item.total_socios
    }
  })
})

onMounted(async () => {
  if (estatisticas.value.length === 0) {
    await socioStore.fetchSociosGraficosTipos()
  }
})
</script>

<style lang="scss" scoped>
.modal-socio-grafico-tipo {
  .grafico-container {
    padding: 2rem;
    max-width: 700px;
    margin: 0 auto;

    .titulo {
      font-family: $font-secondary;
      color: $color-quaternary;
      text-align: center;
      margin-bottom: 2rem;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .conteudo {
      align-items: center;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      gap: 2rem;

      .grafico-wrapper {
        flex: 0 0 300px;

        .grafico-pizza {
          width: 100%;
          height: auto;

          .fatia {
            cursor: pointer;
            transition: opacity 0.2s ease;
            stroke: $color-white;
            stroke-width: 2;

            &.fatia-hover {
              opacity: 1;
            }

            &.fatia-dim {
              opacity: 0.6;
            }

            &.fatia-0 { fill: $color-primary; }
            &.fatia-1 { fill: $color-intercurrences; }
            &.fatia-2 { fill: $color-success; }
            &.fatia-3 { fill: $color-warning; }
            &.fatia-4 { fill: $color-quinary; }
            &.fatia-5 { fill: $color-octonary; }
            &.fatia-6 { fill: $color-nonary; }
            &.fatia-7 { fill: $color-septenary; }
          }

          .label-percentual {
            fill: $color-white;
            font-size: 14px;
            font-weight: 600;
            pointer-events: none;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          }
        }
      }

      .legenda-wrapper {
        flex: 1;
        min-width: 250px;

        .legenda {
          display: flex;
          flex-wrap: wrap;
          flex-direction: row;
          gap: 0.75rem;

          .legenda-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s, transform 0.2s;

            &.legenda-hover {
              background-color: $color-tertiary;
              transform: translateX(5px);
            }

            .legenda-cor {
              width: 24px;
              height: 24px;
              border-radius: 4px;
              flex-shrink: 0;
              border: 1px solid $color-secondary;

              &.cor-0 { background-color: $color-primary; }
              &.cor-1 { background-color: $color-intercurrences; }
              &.cor-2 { background-color: $color-success; }
              &.cor-3 { background-color: $color-warning; }
              &.cor-4 { background-color: $color-quinary; }
              &.cor-5 { background-color: $color-octonary; }
              &.cor-6 { background-color: $color-nonary; }
              &.cor-7 { background-color: $color-septenary; }
            }

            .legenda-info {
              flex: 1;

              .legenda-tipo {
                color: $color-quaternary;
                font-size: 0.95rem;
                font-weight: 500;
                font-family: $font-primary;
              }

              .legenda-dados {
                color: $color-octonary;
                font-size: 0.85rem;
                margin-top: 2px;
              }
            }
          }
        }

        .total-card {
          margin-top: 1.5rem;
          padding: 1rem;
          background-color: $color-tenth;
          border-radius: 8px;
          border-left: 4px solid $color-primary;

          .total-label {
            color: $color-quaternary;
            font-weight: 600;
            margin-bottom: 0.25rem;
            font-size: 0.9rem;
          }

          .total-valor {
            color: $color-primary;
            font-size: 1.5rem;
            font-weight: 700;
          }
        }
      }
    }
  }
}
</style>