import Logger from "../utils/logger.js";

const requestLogger = (req, resp, next) => {
  Logger.info(`Requisição ${req.method} recebida em '${req.path}'. Body: ${JSON.stringify(req.body)}. Query: ${JSON.stringify(req.query)}.`)
  next()
}

export default requestLogger