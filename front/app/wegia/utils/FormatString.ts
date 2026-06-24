class FormatString {

  slugify(text: string) {
    if(text) return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .toLowerCase()

      return text
  }

  parseDataUS (data: string): Date | null {
    if (!data) return null

    const [ano, mes, dia] = data.split('-')
    return new Date(Number(ano), Number(mes) - 1, Number(dia))
  }

}

export default new FormatString()