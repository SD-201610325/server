import Mensagem from "../models/mensagem.js"
import mensagens from "../utils/mensagens.js"
import RecursoService from "../services/recursoService.js";
import Logger from "../utils/logger.js";

const recursoService = new RecursoService()

export default class RecursoController {
  constructor() { }

  getRecurso(req, resp, next) {
    Logger.info(`Iniciando getRecurso...`)

    const recurso = recursoService.getRecurso()
    resp.body = recurso
    resp.send(resp.body)

    Logger.info(`getRecurso finalizado com sucesso!`)
    next()
  }

  requisitarRecurso(req, resp, next) {
    Logger.info(`Iniciando requisitarRecurso...`)
    const sucesso = recursoService.alocarRecurso()

    if (sucesso) {
      const msg = new Mensagem(mensagens.recurso.recursoAlocado, true)
      resp.body = msg
      resp.send(resp.body)

      Logger.info(`requisitarRecurso finalizado com sucesso!`)
      next()
    } else {
      const msg = new Mensagem(mensagens.recurso.recursoIndisponivel, false)
      resp.status(409)
      resp.body = msg
      resp.send(resp.body)
      
      Logger.info(`requisitarRecurso finalizado com falha!`)
      next()
    }
  }
}