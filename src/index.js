'use strict';

import express from 'express'
import requestLogger from './middlewares/requestHandler.js';
import { responseLogger, responseSender } from './middlewares/responseHandler.js';
import routerBinder from './routes/routerBinder.js';
// import UpdaterWorker from './workers/updaterWorker.js';

// const worker = new UpdaterWorker()
// worker.start()

const app = express()
app.use(express.json())
app.use(requestLogger)
routerBinder(app)
app.use(responseLogger)
app.use(responseSender)

const port = process.argv[2] ?? 3000
app.listen(port, '0.0.0.0', () => {
  console.log(`Server escutando com sucesso na porta ${port}!`)
})