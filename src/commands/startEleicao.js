import axios from "axios"
import InfoService from "../services/infoService.js"
import Logger from "../utils/logger.js"
import startEleicaoAnel from "./startEleicaoAnel.js"
import startEleicaoValentao from "./startEleicaoValentao.js"

const httpClient = axios.create()
const infoService = new InfoService()

const startEleicao = async (idEleicao) => {
  Logger.info("StartEleicao iniciado!")
  let falhou = false

  const myInfo = infoService.getMyInfo()

  Logger.info(`Tipo de eleição definido: ${myInfo.eleicao}!`)
  if (myInfo.eleicao.toLowerCase() === "valentao") {
    falhou = !(await startEleicaoValentao(idEleicao))
  } else if (myInfo.eleicao.toLowerCase() === "anel") {
    falhou = !(await startEleicaoAnel(idEleicao))
  } else {
    Logger.error(`Tipo de eleição inválida. Tipo salvo em '/info': ${myInfo.eleicao}!`)
  }

  if (falhou) {
    Logger.warn("StartEleicao finalizado com falha!")
    return false
  }

  Logger.info("StartEleicao finalizado com sucesso!")
  return true
}

export const requestStartEleicao = async (info, idEleicao) => {
  try {
    Logger.info(`Requisitando início de eleição para o servidor '${info.url}' com id de eleição '${idEleicao}'...`)
    const response = await httpClient.post(info.url + "/eleicao", { "id": idEleicao })
    Logger.info(`Resposta do servidor '${info.url}': ${JSON.stringify(response.data)}`)
  } catch (e) {
    const msg = `Erro em POST '/eleicao' do servidor '${info.url}. Mensagem: ${JSON.stringify(e.message)}`
    Logger.error(msg)
    return Promise.reject(msg)
  }
}

export const requestDeclararCoordenador = async (info, idCoordenador, idEleicao) => {
  try {
    Logger.info(`Enviando declaração de coordenador para o servidor '${info.url}' com id coordenador '${idCoordenador}' e id de eleição '${idEleicao}'...`)
    const response = await httpClient.post(info.url + "/eleicao/coordenador", { "coordenador": idCoordenador, "id_eleicao": idEleicao })
    Logger.info(`Resposta do servidor '${info.url}': ${JSON.stringify(response.data)}`)
  } catch (e) {
    const msg = `Erro em POST '/eleicao/coordenador' do servidor '${info.url}'. Mensagem: ${JSON.stringify(e.message)}`
    Logger.error(msg)
    return Promise.reject(msg)
  }
}

export default startEleicao