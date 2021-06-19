let eleicaoAtual = {
  "id": undefined,
  "ativo": false
}

export default class EleicaoService {
  constructor() { }

  getEleicaoAtual() {
    return eleicaoAtual
  }

  setEleicaoAtual(eleicao) {
    eleicaoAtual = eleicao
  }

  finalizaEleicaoAtual() {
    eleicaoAtual.ativo = false
  }
}