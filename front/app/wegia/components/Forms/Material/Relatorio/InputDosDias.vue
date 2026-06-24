<template>
  <div>
    <div class="ultimos">
      <butao texto="Últimos 7 dias" @click-botao="emitirPeriodo(7)" />
      <butao texto="Últimos 30 dias" @click-botao="emitirPeriodo(30)" />
      <butao texto="Últimos 180 dias" @click-botao="emitirPeriodo(180)" />
      <butao texto="Últimos 365 dias" @click-botao="emitirPeriodo(365)" />
    </div>

    <div class="essa">
      <butao texto="Essa semana" @click-botao="emitirPeriodoEspecial('semana')" />
      <butao texto="Esse mês" @click-botao="emitirPeriodoEspecial('mes')" />
      <butao texto="Esse ano" @click-botao="emitirPeriodoEspecial('ano')" />
    </div>
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits(['atualizar-periodo'])

const emitirPeriodo = (dias: number) => {
  const hoje = new Date()
  const dataInicial = new Date()
  dataInicial.setDate(hoje.getDate() - dias)

  emit('atualizar-periodo', {
    inicio: formatarData(dataInicial),
    fim: formatarData(hoje)
  })
}

const emitirPeriodoEspecial = (tipo: 'semana' | 'mes' | 'ano') => {
  const hoje = new Date()
  let inicio = new Date()

  if (tipo === 'semana') {
    const diaSemana = hoje.getDay()
    inicio.setDate(hoje.getDate() - diaSemana)
  } else if (tipo === 'mes') {
    inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  } else if (tipo === 'ano') {
    inicio = new Date(hoje.getFullYear(), 0, 1)
  }

  emit('atualizar-periodo', {
    inicio: formatarData(inicio),
    fim: formatarData(hoje)
  })
}

const formatarData = (data: Date) => {
  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const ano = data.getFullYear()
  return `${dia}/${mes}/${ano}`
}
</script>

<style scoped lang="scss">
.ultimos, .essa {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 24px;

  button {
    width: 200px;
  }
}
</style>
