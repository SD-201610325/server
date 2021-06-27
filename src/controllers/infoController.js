import InfoService from "../services/infoService.js"
import Logger from "../utils/logger.js"
import mensagens from "../utils/mensagens.js"

const infoService = new InfoService()

export default class InfoController {
  constructor() { }
  
  getMyInfo(req, resp, next) {
    Logger.info(`Iniciando getMyInfo...`)
    const myInfo = infoService.getMyInfo()

    resp.body = myInfo
    resp.send(resp.body)

    Logger.info(`getMyInfo finalizado com sucesso!`)
    next()
  }

  updateMyInfo(req, resp, next) {
    Logger.info(`Iniciando updateMyInfo...`)
    const novaInfo = infoService.updateMyInfo(req.body)

    const resposta = {
      "mensagem": mensagens.info.infoAtualizada,
      "novaInfo": novaInfo
    }
    resp.body = resposta
    resp.send(resp.body)
    
    Logger.info(`updateMyInfo finalizado com sucesso!`)
    next()
  }
}