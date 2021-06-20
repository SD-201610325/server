import axios from "axios"
import InfoService from "../services/infoService.js"
import Logger from "../utils/logger.js"
import startEleicao from "./startEleicao.js"
import { v4 as uuid } from "uuid"

const httpClient = axios.create()
const infoService = new InfoService()

const coordenaInicioEleicao = async () => {
  Logger.info("CoordenaInicioEleicao iniciado!")

  Logger.info("Chamando DetermineStartEleicao...")
  const isStartEleicao = await determinaStartEleicao()
  let eleicaoIniciada = false
  if (isStartEleicao) {
    Logger.info("Chamando StartEleicao...")
    const idEleicao = uuid()
    eleicaoIniciada = await startEleicao(idEleicao)
  }

  Logger.info(`CoordenaInicioEleicao finalizado com sucesso! Eleição iniciada: ${eleicaoIniciada}`)
}

const determinaStartEleicao = async () => {
  Logger.info("DetermineStartEleicao iniciado!")

  const myInfo = infoService.getMyInfo()
  if (myInfo.status.toLowerCase() !== "up") {
    return false
  }

  const othersInfos = infoService.getOthersInfo()
  const coordenador = infoService.getCoordenadorAtual()
  
  let startEleicao = false

  if (!coordenador) {
    startEleicao = true
    Logger.info("Determinando início de eleição pois nenhum coordenador ainda foi definido!")
  } else if (myInfo.identificacao > coordenador) {
    startEleicao = true
    Logger.info("Determinando início de eleição por prioridade deste server!")
  } else if (myInfo.identificacao < coordenador) {
    const otherCoordenador = othersInfos.find(o => o.identificacao === coordenador)
    const serverCoordenador = myInfo.servidores_conhecidos.find(s => s.id === otherCoordenador?.id)
    const serverUp = await isServerUp(serverCoordenador?.url)
    if (!serverUp) {
      startEleicao = true
      Logger.info("Determinando início de eleição pois atual coordenador não está disponível!")
    }
  }

  Logger.info(`DetermineStartEleicao finalizado com sucesso! Iniciar eleição: ${startEleicao}`)
  return startEleicao
}

const isServerUp = async (url) => {
  if (!url) {
    return false
  }

  try {
    const response = await httpClient.get(url + "/info")
    if (response?.data?.status.toLowerCase() === "up") {
      return true
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}

export default coordenaInicioEleicao