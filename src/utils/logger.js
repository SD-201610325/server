import axios from "axios"
import config from "../../config.js"

export default class Logger {
  constructor() { }

  static error(mensagem) {
    console.error(`\x1b[31m[ERROR]\x1b[0m ${mensagem}`)
    const httpClient = axios.create()
    httpClient.post(
      config.LOG_SERVER_BASE_URL + "/log",
      {
        "from": "https://sd-app-server-jesulino.herokuapp.com",
        "severity": "Erro",
        "comment": `Erro no servidor 'https://sd-app-server-jesulino.herokuapp.com'`,
        "body": mensagem
      })
  }

  static info(mensagem) {
    console.log(`\x1b[34m[INFO]\x1b[0m ${mensagem}`)
  }

  static warn(mensagem) {
    console.warn(`\x1b[33m[WARN]\x1b[0m ${mensagem}`)
  }
}