import EleicaoService from "../services/eleicaoService.js"
import InfoService from "../services/infoService.js"
import Logger from "../utils/logger.js"
import { requestDeclararCoordenador, requestStartEleicao } from "./startEleicao.js"

const eleicaoService = new EleicaoService()
const infoService = new InfoService()

const startEleicaoValentao = async (idEleicao) => {
  Logger.info("StartEleicaoValentao iniciado!")

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
      Logger.warn("StartEleicaoValentao finalizado com falha!")
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
      Logger.warn("StartEleicaoValentao finalizado com falha!")
      return false
    }
  }

  Logger.info("StartEleicaoValentao finalizado com sucesso!")
  return true
}

export default startEleicaoValentao