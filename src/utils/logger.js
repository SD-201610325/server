export default class Logger {
  constructor() { }

  static error(mensagem) {
    console.error(` -- [ERROR] -- ${mensagem}`)
  }

  static info(mensagem) {
    console.log(` -- [INFO] -- ${mensagem}`)
  }

  static warn(mensagem) {
    console.warn(` -- [WARN] -- ${mensagem}`)
  }
}