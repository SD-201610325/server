import config from "../../config.js"
import EleicaoService from "../services/eleicaoService.js"
import InfoService from "../services/infoService.js"
import Logger from "../utils/logger.js"
import { requestDeclararCoordenador, requestStartEleicao } from "./startEleicao.js"

const eleicaoService = new EleicaoService()
const infoService = new InfoService()

const startEleicaoAnel = async (idEleicao) => {
  Logger.info("StartEleicaoAnel iniciado!")

  const eleicaoAtual = eleicaoService.getEleicaoAtual()
  const myInfo = infoService.getMyInfo()
  const othersInfo = infoService.getOthersInfo()
  const array = idEleicao.split(config.ELEICAO_ANEL_SEPARATOR)
  const codigoEleicao = {
    "idEleicao": array.shift(),
    "idNodes": array
  }
  eleicaoService.setEleicaoAtual({ "id": codigoEleicao.idEleicao, "ativo": true })

  if (codigoEleicao.idEleicao === eleicaoAtual.id && codigoEleicao.idNodes.length > 0 && codigoEleicao.idNodes[0] == myInfo.identificacao) {
    Logger.info("Eleição iniciada por este server completou o anel!")
    const success = await declaraCoordenador(codigoEleicao, othersInfo, myInfo)
    if (!success) {
      Logger.warn("StartEleicaoAnel finalizado com falha!")
      return false
    }
    Logger.info("StartEleicaoAnel finalizado com sucesso!")
    return true
  }

  let sortedInfo = othersInfo.sort((a,b) => a.identificacao - b.identificacao)
  let nextInfo = sortedInfo
    .find(o => o.identificacao > myInfo.identificacao && o.status.toLowerCase() === "up" && o.eleicao.toLowerCase() === "anel")

  if (!nextInfo) {
    nextInfo = sortedInfo
      .find(o => o.identificacao < myInfo.identificacao && o.status.toLowerCase() == "up" && o.eleicao.toLowerCase() === "anel")
  }

  if (!nextInfo) {
    Logger.info("Nenhum servidor disponível encontrado. Declarando-se coordenador...")
    infoService.updateMyInfo({ "lider": 1 })
    infoService.atualizaCoordenador(myInfo.identificacao)
    eleicaoService.finalizaEleicaoAtual()
  } else {
    Logger.info("Encontrado próximo server no anel. Repassando mensagem de eleição...")

    if (!codigoEleicao.idNodes.some(a => a == myInfo.identificacao)) {
      codigoEleicao.idNodes.push(myInfo.identificacao.toString())
    }
    const nextServer = myInfo.servidores_conhecidos.find(s => s.id === nextInfo.id)
    if (!nextServer) {
      Logger.error(`Próximo servidor no anel não encontrado na lista de servidores conhecidos!`)
      Logger.warn("StartEleicaoAnel finalizado com falha!")
      return false
    }

    const novoIdEleicao = codigoEleicao.idEleicao + config.ELEICAO_ANEL_SEPARATOR + codigoEleicao.idNodes.join(config.ELEICAO_ANEL_SEPARATOR)
    await requestStartEleicao(nextServer, novoIdEleicao)
      .catch(e => {
        Logger.error(`Erro ao repassar mensagem de eleição para servidor '${nextServer.url}'!`)
        Logger.warn("StartEleicaoAnel finalizado com falha!")
      })
    eleicaoService.setEleicaoAtual({ "id": codigoEleicao.idEleicao, "ativo": true })
  }

  Logger.info("StartEleicaoAnel finalizado com sucesso!")
  return true
}

const declaraCoordenador = async (codigoEleicao, othersInfo, myInfo) => {
  Logger.info("Enviando declarações de coordenador e finalizando eleição...")
  
  const idCoordenador = Math.max(...codigoEleicao.idNodes)
  const idEleicao = codigoEleicao.idEleicao + config.ELEICAO_ANEL_SEPARATOR + codigoEleicao.idNodes.join(config.ELEICAO_ANEL_SEPARATOR)

  const filteredOthersInfo = othersInfo
    .filter(o => codigoEleicao.idNodes.some(i => i == o.identificacao))

  const promises = filteredOthersInfo.map(e => requestDeclararCoordenador(myInfo.servidores_conhecidos.find(s => s.id === e.id), idCoordenador, idEleicao))
  const resolved = await Promise.allSettled(promises)
  
  if (idCoordenador === myInfo.identificacao) {
    infoService.updateMyInfo({ "lider": 1 })
  }
  infoService.atualizaCoordenador(idCoordenador)
  eleicaoService.finalizaEleicaoAtual()

  if (resolved.some(r => r.status !== "fulfilled")) {
    Logger.error(`Erro durante envio de declaração de coordenador para ao menos um servidor!`)
    return false
  }

  return true
}

export default startEleicaoAnel