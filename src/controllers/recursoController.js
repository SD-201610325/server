import Mensagem from "../models/mensagem.js"
import mensagens from "../utils/mensagens.js"
import RecursoService from "../services/recursoService.js";
import Logger from "../utils/logger.js";
import BaseController from "./baseController.js";
import InfoService from "../services/infoService.js";
import updateInfo from "../commands/updateInfo.js";

const recursoService = new RecursoService()
const infoService = new InfoService()

export default class RecursoController extends BaseController {
  constructor() {
    super()
  }

  getRecurso(req, resp, next) {
    Logger.info(`Iniciando getRecurso...`)

    const myInfo = infoService.getMyInfo()
    const coordAtual = infoService.getCoordenadorAtual()
    const recurso = recursoService.getRecurso()

    if (myInfo.lider) {
      super.sendResponse(resp, {"ocupado": recurso.ocupado, "id_lider": coordAtual}, next)
    } else {
      if (recurso.acessandoRecurso) {
        resp.status(409)
      }
      super.sendResponse(resp, {"ocupado": recurso.acessandoRecurso, "id_lider": coordAtual}, next)
    }

    Logger.info(`getRecurso finalizado com sucesso!`)
  }

  async requisitarRecurso(req, resp, next) {
    Logger.info(`Iniciando requisitarRecurso...`)
    const coordAtual = infoService.getCoordenadorAtual()
    const recurso = recursoService.getRecurso()

    if (!coordAtual) {
      const msg = new Mensagem(mensagens.recurso.nenhumLider, false)
      resp.status(409)
      super.sendResponse(resp, msg, next)
      Logger.warn(`Nenhum coordenador definido. requisitarRecurso finalizado com falha!`)
      return
    }

    if (recurso.ocupado || recurso.acessandoRecurso) {
      const msg = new Mensagem(mensagens.recurso.recursoIndisponivel, false)
      resp.status(409)
      super.sendResponse(resp, msg, next)
      Logger.warn(`Recurso indisponível. requisitarRecurso finalizado com falha!`)
      return
    }

    const myInfo = infoService.getMyInfo()

    if (!myInfo.lider) {
      Logger.info(`Iniciando processo de verificar disponibilidade do líder...`)

      Logger.info("Chamando UpdateInfo...")
      const othersInfo = await updateInfo()

      Logger.info(`Verificando disponibilidade do líder com outros servidores...`)
      const liberado = await recursoService.verificaDisponibilidade(coordAtual, myInfo, othersInfo)

      if (liberado) {
        const message = await recursoService.requisitaRecursoLider(coordAtual, othersInfo, myInfo)
        if (message !== "sucesso") {
          const msg = new Mensagem(mensagens.recurso.erroRecursoLider + " Mensagem: " + message, false)
          resp.status(500)
          super.sendResponse(resp, msg, next)
          return
        }
        recursoService.setarRecursoLider()
        const msg = new Mensagem(mensagens.recurso.recursoLiderRequisitado, true)
        super.sendResponse(resp, msg, next)
      } else {
        const msg = new Mensagem(mensagens.recurso.recursoOcupado, false)
        resp.status(409)
        super.sendResponse(resp, msg, next)
      }

      return
    }

    Logger.info(`Iniciando alocação de recurso como líder...`)
    const sucesso = recursoService.alocarRecurso()

    if (sucesso) {
      const msg = new Mensagem(mensagens.recurso.recursoAlocado, true)
      super.sendResponse(resp, msg, next)

      Logger.info(`requisitarRecurso finalizado com sucesso!`)
      next()
    } else {
      const msg = new Mensagem(mensagens.recurso.recursoIndisponivel, false)
      resp.status(409)
      super.sendResponse(resp, msg, next)

      Logger.info(`requisitarRecurso finalizado com falha!`)
    }
  }
}