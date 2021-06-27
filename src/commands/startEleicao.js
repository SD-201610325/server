import axios from "axios"
import EleicaoService from "../services/eleicaoService.js"
import InfoService from "../services/infoService.js"
import Logger from "../utils/logger.js"

const httpClient = axios.create()
const eleicaoService = new EleicaoService()
const infoService = new InfoService()

const startEleicao = async (idEleicao) => {
  Logger.info("StartEleicao iniciado!")

  const myInfo = infoService.getMyInfo()

  const othersInfo = infoService.getOthersInfo()

  const filteredOthersInfo = othersInfo
    .filter(o => o.identificacao > myInfo.identificacao && o.status.toLowerCase() == "up")

  if (filteredOthersInfo.length) {
    Logger.info("Encontrado servidores maiores. Enviando requisições de eleição...")

    const promises = filteredOthersInfo.map(e => requestStartEleicao(myInfo.servidores_conhecidos.find(s => s.id === e.id), idEleicao))
    const resolved = await Promise.allSettled(promises)

    if (resolved.some(r => r.status !== "fulfilled")) {
      Logger.error(`Erro durante envio de requisições de eleição para ao menos um servidor!`)
      Logger.warn("StartEleicao finalizado com falha!")
      return false
    }

    Logger.info("Processo de eleição repassado para outros servidores com sucesso!")
  } else {
    Logger.info("Nenhum servidor maior encontrado. Enviando declarações de coordenador e finalizando eleição...")
    
    const promises = myInfo.servidores_conhecidos.map(s => requestDeclararCoordenador(s, myInfo.identificacao, idEleicao))
    const resolved = await Promise.allSettled(promises)
    
    infoService.updateMyInfo({ "lider": 1 })
    infoService.atualizaCoordenador(myInfo.identificacao)
    eleicaoService.finalizaEleicaoAtual()

    if (resolved.some(r => r.status !== "fulfilled")) {
      Logger.error(`Erro durante envio de declaração de coordenador para ao menos um servidor!`)
      Logger.warn("StartEleicao finalizado com falha!")
      return false
    }
  }

  Logger.info("StartEleicao finalizado com sucesso!")
  return true
}

const requestStartEleicao = async (info, idEleicao) => {
  try {
    Logger.info(`Requisitando início de eleição para o servidor '${info.url}'...`)
    const response = await httpClient.post(info.url + "/eleicao", { "id": idEleicao })
    Logger.info(`Resposta do servidor '${info.url}': ${JSON.stringify(response.data)}`)
  } catch (e) {
    const msg = `Erro em POST '/eleicao' do servidor '${info.url}. Mensagem: ${JSON.stringify(e.message)}`
    Logger.error(msg)
    return Promise.reject(msg)
  }
}

const requestDeclararCoordenador = async (info, idCoordenador, idEleicao) => {
  try {
    Logger.info(`Enviando declaração de coordenador para o servidor '${info.url}'...`)
    const response = await httpClient.post(info.url + "/eleicao/coordenador", { "coordenador": idCoordenador, "id_eleicao": idEleicao })
    Logger.info(`Resposta do servidor '${info.url}': ${JSON.stringify(response.data)}`)
  } catch (e) {
    const msg = `Erro em POST '/eleicao/coordenador' do servidor '${info.url}'. Mensagem: ${JSON.stringify(e.message)}`
    Logger.error(msg)
    return Promise.reject(msg)
  }
}

export default startEleicao