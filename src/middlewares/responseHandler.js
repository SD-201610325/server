import Logger from "../utils/logger.js";

export const responseLogger = (req, resp, next) => {
  Logger.info(`Resposta enviada para o ${req.method} em '${req.path}'. Status Code: ${resp.statusCode}. Response Body: ${JSON.stringify(resp.body)}.`)
  next()
}