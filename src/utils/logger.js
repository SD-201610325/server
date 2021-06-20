export default class Logger {
  constructor() { }

  static error(mensagem) {
    const now = new Date(Date.UTC() - 3 * 60 * 60 * 1000);
    const nowString = formatDate(now)
    console.log(`\x1b[31m[ERROR]\x1b[0m ${nowString} ${mensagem}`)
  }

  static info(mensagem) {
    const now = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const nowString = formatDate(now)
    console.log(`\x1b[34m[INFO]\x1b[0m ${nowString} ${mensagem}`)
  }

  static warn(mensagem) {
    const now = new Date(Date.UTC() - 3 * 60 * 60 * 1000);
    const nowString = formatDate(now)
    console.log(`\x1b[33m[WARN]\x1b[0m ${nowString} ${mensagem}`)
  }
}

const formatDate = (date) => {
  return date.getUTCFullYear() + "-" +
    ("0" + (date.getUTCMonth()+1)).slice(-2) + "-" +
    ("0" + date.getUTCDate()).slice(-2) + " " +
    ("0" + date.getUTCHours()).slice(-2) + ":" +
    ("0" + date.getUTCMinutes()).slice(-2) + ":" +
    ("0" + date.getUTCSeconds()).slice(-2) + "-03:00";
}