export default class Logger {
  constructor() { }

  static error(mensagem) {
    console.error(`\x1b[31m[ERROR]\x1b[0m ${mensagem}`)
  }

  static info(mensagem) {
    console.log(`\x1b[34m[INFO]\x1b[0m ${mensagem}`)
  }

  static warn(mensagem) {
    console.warn(`\x1b[33m[WARN]\x1b[0m ${mensagem}`)
  }
}