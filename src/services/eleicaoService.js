import Logger from "../utils/logger.js"

let eleicaoAtual = {
  "id": undefined,
  "ativo": false
}

export default class EleicaoService {
  constructor() { }

  getEleicaoAtual() {
    Logger.info(`Consultando eleicao atual...`)
    const eleicao = eleicaoAtual
    Logger.info(`Eleicao atual consultada com sucesso! Valor: ${JSON.stringify(eleicao)}`)
    return eleicao
  }

  setEleicaoAtual(eleicao) {
    Logger.info(`Atualizando eleicao atual com objeto ${JSON.stringify(eleicao)}...`)
    eleicaoAtual = eleicao
    Logger.info(`Eleicao atual atualizada com sucesso!`)
  }

  finalizaEleicaoAtual() {
    Logger.info(`Finalizando eleicao atual de id '${eleicaoAtual.id}'...`)
    eleicaoAtual.ativo = false
    Logger.info(`Eleicao atual finalizada com sucesso!`)
  }
}