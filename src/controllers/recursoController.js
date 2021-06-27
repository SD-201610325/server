import Mensagem from "../models/mensagem.js"
import mensagens from "../utils/mensagens.js"
import RecursoService from "../services/recursoService.js";
import Logger from "../utils/logger.js";
import BaseController from "./baseController.js";

const recursoService = new RecursoService()

export default class RecursoController extends BaseController {
  constructor() {
    super()
  }

  getRecurso(req, resp, next) {
    Logger.info(`Iniciando getRecurso...`)

    const recurso = recursoService.getRecurso()
    super.sendResponse(resp, recurso)

    Logger.info(`getRecurso finalizado com sucesso!`)
    next()
  }

  requisitarRecurso(req, resp, next) {
    Logger.info(`Iniciando requisitarRecurso...`)
    const sucesso = recursoService.alocarRecurso()

    if (sucesso) {
      const msg = new Mensagem(mensagens.recurso.recursoAlocado, true)
      super.sendResponse(resp, msg)

      Logger.info(`requisitarRecurso finalizado com sucesso!`)
      next()
    } else {
      const msg = new Mensagem(mensagens.recurso.recursoIndisponivel, false)
      resp.status(409)
      super.sendResponse(resp, msg)

      Logger.info(`requisitarRecurso finalizado com falha!`)
      next()
    }
  }
}