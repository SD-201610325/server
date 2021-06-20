export default class Logger {
  constructor() { }

  static error(mensagem) {
    console.error(`${mensagem}`)
  }

  static info(mensagem) {
    console.log(`${mensagem}`)
  }

  static warn(mensagem) {
    console.warn(`${mensagem}`)
  }
}