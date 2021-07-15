import axios from "axios";
import config from "../../config.js";
import InfoService from "../services/infoService.js";
import Logger from "../utils/logger.js";

const infoService = new InfoService()
const httpClient = axios.create()

const updateInfo = async () => {
  Logger.info("UpdateInfoCommand iniciado!")
  let othersInfo = []

  const myInfo = infoService.getMyInfo()
  for await (const info of myInfo.servidores_conhecidos.map(e => requestInfoServer(e))) {
    if (info) {
      if (info.status?.toLowerCase() == "up") {
        othersInfo.push(info)
      }
    }
  }

  infoService.setOthersInfo(othersInfo)

  Logger.info("UpdateInfoCommand finalizado com sucesso!")
  return othersInfo
}

const requestInfoServer = async (info) => {
  try {
    Logger.info(`Requisitando info do servidor '${info.url}'...`)
    httpClient.post(
      config.LOG_SERVER_BASE_URL + "/log",
      {
        "from": "https://sd-app-server-jesulino.herokuapp.com",
        "severity": "sucesso",
        "comment": `Requisitando info do servidor '${info.url}'`
      })
    const response = await httpClient.get(info.url + "/info")
    Logger.info(`Resposta do servidor '${info.url}': ${JSON.stringify(response.data)}`)
    response.data.id = info.id
    return response.data
  } catch (e) {
    Logger.error(`Erro em GET '/info' do servidor '${info.url}'. Mensagem: ${JSON.stringify(e.message)}`)
    return
  }
}

export default updateInfo