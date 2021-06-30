import axios from "axios";
import config from "../../config.js";
import Logger from "../utils/logger.js";

const requestLogger = (req, resp, next) => {
  Logger.info(`Requisição ${req.method} recebida em '${req.path}'. Body: ${JSON.stringify(req.body)}. Query: ${JSON.stringify(req.query)}.`)
  const httpClient = axios.create()
  httpClient.post(
    config.LOG_SERVER_BASE_URL + "/log",
    {
      "from": "https://sd-app-server-jesulino.herokuapp.com",
      "severity": "Request recebida",
      "comment": `Requisição ${req.method} recebida em '${req.path}'`,
      "body": req.body
    })
  next()
}

export default requestLogger