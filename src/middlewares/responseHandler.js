import Logger from "../utils/logger.js";

export const responseLogger = (req, resp, next) => {
  Logger.info(`Enviando resposta para o ${req.method} em '${req.path}'. Response Body: ${JSON.stringify(resp.body)}.`)
  next()
}

export const responseSender = (req, resp, next) => {
  resp.send(resp.body)
  next()
}