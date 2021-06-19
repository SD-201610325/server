import Mensagem from "../models/mensagem.js"
import mensagens from "../utils/mensagens.js"
import RecursoService from "../services/recursoService.js";

const recursoService = new RecursoService()

export default class RecursoController {
  constructor() { }

  getRecurso(req, resp) {
    const recurso = recursoService.getRecurso()
    resp.send(recurso)
  }

  requisitarRecurso(req, resp) {
    const sucesso = recursoService.alocarRecurso()

    if (sucesso) {
      const msg = new Mensagem(mensagens.recurso.recursoAlocado, true)
      resp.send(msg)
    } else {
      const msg = new Mensagem(mensagens.recurso.recursoIndisponivel, false)
      resp.status(409)
      resp.send(msg)
    }
  }
}