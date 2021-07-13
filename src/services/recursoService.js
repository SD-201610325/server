import axios from "axios"
import config from "../../config.js"
import Logger from "../utils/logger.js"

const httpClient = axios.create()

let recurso = {
  "ocupado": false,
  "acessandoRecurso": false
}

export default class RecursoService {
  constructor() { }
  
  getRecurso() {
    const recursoObtido = recurso
    Logger.info(`Estado do recurso consultada com sucesso! Valor: ${recursoObtido}`)
    return recursoObtido
  }

  alocarRecurso() {
    Logger.info(`Alocando recurso...`)
    if (recurso.ocupado) {
      Logger.warn(`Não foi possível alocar recurso. Recurso já está alocado no momento!`)
      return false
    } else {
      recurso.ocupado = true
      Logger.info(`Recurso alocado com sucesso!`)
      const atraso = config.RECURSO_LOCK_DELAY
      Logger.info(`Programando desalocar recurso para iniciar em ${atraso / 1000}s`)
      setTimeout(this.desalocarRecurso, atraso)
      return true
    }
  }

  desalocarRecurso() {
    Logger.info(`Desalocando recurso...`)
    recurso.ocupado = false
    Logger.info(`Recurso desalocado com sucesso!`)
  }

  async verificaDisponibilidade(coordAtual, myInfo, othersInfo) {
    const leader = othersInfo.find(o => o.identificacao == coordAtual)
    if (!leader) {
      Logger.error("Líder não encontrado nos servidores conhecidos!")
      return false
    }
    const serversToRequest = myInfo.servidores_conhecidos.filter(s => s.id !== leader.id)

    Logger.info("Requisitando situação do recurso para servidores não líder...")
    const promises = serversToRequest.map(e => this.verificaRecurso(e))
    const resolved = await Promise.allSettled(promises)

    if (resolved.some(r => r.status !== "fulfilled")) {
      Logger.warn(`Pelo menos um servidor retornou indisponibilidade ou erro!`)
      return false
    } else {
      Logger.info(`Todos servidores retornaram OK!`)
      return true
    }
  }

  async verificaRecurso(info) {
    try {
      Logger.info(`Enviando GET /recurso para o servidor '${info.url}'...`)
      httpClient.post(
        config.LOG_SERVER_BASE_URL + "/log",
        {
          "from": "https://sd-app-server-jesulino.herokuapp.com",
          "severity": "sucesso",
          "comment": `Enviando GET /recurso para o servidor '${info.url}''`
        })
      const response = await httpClient.get(info.url + "/recurso")
      Logger.info(`Resposta do servidor '${info.url}': ${JSON.stringify(response.data)}`)
    } catch (e) {
      const msg = `Erro em GET '/recurso' do servidor '${info.url}'. Mensagem: ${JSON.stringify(e.message)}`
      Logger.error(msg)
      return Promise.reject(msg)
    }
  }

  async requisitaRecursoLider(coordAtual, othersInfo) {
    const leader = othersInfo.find(o => o.identificacao == coordAtual)
    try {
      const response = await this.requisitaRecurso(leader)
    } catch (e) {
      Logger.error(`Erro ao requisitar recurso do líder. Mensagem: ${JSON.stringify(e.message)}`)
      return false
    }

    return true
  }

  async requisitaRecurso(info) {
    try {
      Logger.info(`Enviando POST /recurso para o servidor '${info.url}'...`)
      httpClient.post(
        config.LOG_SERVER_BASE_URL + "/log",
        {
          "from": "https://sd-app-server-jesulino.herokuapp.com",
          "severity": "sucesso",
          "comment": `Enviando POST /recurso para o servidor '${info.url}''`
        })
      const response = await httpClient.post(info.url + "/recurso")
      Logger.info(`Resposta do servidor '${info.url}': ${JSON.stringify(response.data)}`)
    } catch (e) {
      const msg = `Erro em GET '/recurso' do servidor '${info.url}'. Mensagem: ${JSON.stringify(e.message)}`
      Logger.error(msg)
      return Promise.reject(msg)
    }
  }
}