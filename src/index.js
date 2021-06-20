'use strict';

import express from 'express'
import requestLogger from './middlewares/requestHandler.js';
import { responseLogger, responseSender } from './middlewares/responseHandler.js';
import routerBinder from './routes/routerBinder.js';

const app = express()
app.use(express.json())
app.use(requestLogger)
routerBinder(app)
app.use(responseLogger)
app.use(responseSender)

const port = process.argv[2] ?? 3000
app.listen(port, '0.0.0.0', () => {
  console.log(`Aplicação Iniciada com Sucesso na porta ${port}!`)
})