import config from "../../config.js"
import coordenaInicioEleicao from "../commands/coordenaInicioEleicao.js"
import updateInfo from "../commands/updateInfo.js"
import Logger from "../utils/logger.js"

export default class UpdaterWorker {
  constructor() {}

  async start() {
    Logger.info("Chamando UpdateInfo...")
    await updateInfo()
    Logger.info("Chamando CoordenaInicioEleicao...")
    await coordenaInicioEleicao()

    const atraso = config.UPDATE_INFO_DELAY_MS
    Logger.info(`Programando próximo Updater para iniciar em ${atraso / 1000}s!`)
    setTimeout(() => this.start(), atraso)
  }
}