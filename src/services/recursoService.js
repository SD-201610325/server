import Logger from "../utils/logger.js"

let recurso = {
  "ocupado": false
}

export default class RecursoService {
  constructor() { }
  
  getRecurso() {
    Logger.info(`Consultando estado do recurso...`)
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
      const atraso = 10000
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
}