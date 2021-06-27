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
    await Promise.all(filteredOthersInfo.map(e => requestStartEleicao(myInfo.servidores_conhecidos.find(s => s.id === e.id), idEleicao)))
    Logger.info("Processo de eleição repassado para outros servidores!")
  } else {
    Logger.info("Nenhum servidor maior encontrado. Enviando requisições de coordenador e finalizando eleição...")
    await Promise.all(myInfo.servidores_conhecidos.map(e => requestDeclararCoordenador(e, myInfo.identificacao, idEleicao)))
    infoService.updateMyInfo({ "lider": 1 })
    infoService.atualizaCoordenador(myInfo.identificacao)
    eleicaoService.finalizaEleicaoAtual()
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
    Logger.error(`Erro em POST '/eleicao' do servidor '${info.url}. Mensagem: ${JSON.stringify(e.message)}`)
  }
}

const requestDeclararCoordenador = async (info, idCoordenador, idEleicao) => {
  try {
    Logger.info(`Enviando declaração de coordenador para o servidor '${info.url}'...`)
    const response = await httpClient.post(info.url + "/eleicao/coordenador", { "coordenador": idCoordenador, "id_eleicao": idEleicao })
    Logger.info(`Resposta do servidor '${info.url}': ${JSON.stringify(response.data)}`)
  } catch (e) {
    Logger.error(`Erro em POST '/eleicao/coordenador' do servidor '${info.url}'. Mensagem: ${JSON.stringify(e.message)}`)
  }
}

export default startEleicao