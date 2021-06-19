'use strict';

import express from 'express'
import routerBinder from './routes/routerBinder.js';

const app = express()
app.use(express.json())

routerBinder(app)

const port = process.argv[2] ?? 3000
app.listen(port, '0.0.0.0', () => {
  console.log(`Aplicação Iniciada com Sucesso na porta ${port}!`)
})