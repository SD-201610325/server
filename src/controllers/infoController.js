import InfoService from "../services/infoService.js"
import Logger from "../utils/logger.js"
import mensagens from "../utils/mensagens.js"
import BaseController from "./baseController.js"

const infoService = new InfoService()

export default class InfoController extends BaseController {
  constructor() {
    super()
  }
  
  getMyInfo(req, resp, next) {
    // Logger.info(`Iniciando getMyInfo...`)
    const myInfo = infoService.getMyInfo()

    super.sendResponse(resp, myInfo, next)

    // Logger.info(`getMyInfo finalizado com sucesso!`)
  }

  updateMyInfo(req, resp, next) {
    Logger.info(`Iniciando updateMyInfo...`)
    const novaInfo = infoService.updateMyInfo(req.body)

    const resposta = {
      "mensagem": mensagens.info.infoAtualizada,
      "novaInfo": novaInfo
    }
    super.sendResponse(resp, resposta, next)

    Logger.info(`updateMyInfo finalizado com sucesso!`)
  }
}