'use strict';

import express from 'express'
import notFoundHandler from './middlewares/notFoundHandler.js';
import requestLogger from './middlewares/requestHandler.js';
import { responseLogger } from './middlewares/responseHandler.js';
import routerBinder from './routes/routerBinder.js';
// import UpdaterWorker from './workers/updaterWorker.js';

// const worker = new UpdaterWorker()
// worker.start()

const app = express()
app.use(express.json())
app.use(requestLogger)
routerBinder(app)
app.use(notFoundHandler)
app.use(responseLogger)

const port = process.argv[2] ?? 3000
app.listen(port, '0.0.0.0', () => {
  console.log(`Server escutando com sucesso na porta ${port}!`)
})