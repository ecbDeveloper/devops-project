class Pagamento {

  execucaoAposCriadoPagamento(pagamentos: ContribuicaoPagamentoAposCriadoInterface[], socio: SocioPublicoInterface) {
    let tipoPagamento = ''

    const pagamento = pagamentos[0]
    switch(pagamento.metodo.toLowerCase()) {
      case 'pix':
        tipoPagamento = 'PIX'
        break
      case 'boleto':
        window.open(pagamento.imagem, '_blank')
        tipoPagamento = 'boleto'
        break
      case 'carne':
        tipoPagamento = 'carnê'
        const urlCompleta = `${window.location.origin}${pagamento.url_privada}`
        window.open(urlCompleta, '_blank')
        setTimeout(() => {
          baixarImagem(urlCompleta, 'pdf', `carne_contribuicao_${socio.nome.replace(/\s+/g, '_').toLowerCase()}.pdf`)
        }, 500)
        break
      case 'cartaocredito':
      case 'recorrencia':
        tipoPagamento = 'cartão de crédito'
        break
    }

    return tipoPagamento
  }

}

export default new Pagamento()