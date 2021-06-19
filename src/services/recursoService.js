let recurso = {
  "ocupado": false
}

export default class RecursoService {
  constructor() { }
  
  getRecurso() {
    return recurso
  }

  alocarRecurso() {
    if (recurso.ocupado) {
      return false
    } else {
      recurso.ocupado = true
      setTimeout(() => recurso.ocupado = false, 10000)
      return true
    }
  }
}