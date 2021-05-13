'use strict';

import express from 'express'

const app = express()
app.use(express.json())

app.get('/info', (req, resp) => {
  const result = {
    "componente": "server",
    "descrição": "Serve os clientes com os serviços X, Y e Z",
    "versao": "0.1"
  }
  resp.send(result)
})

const server = app.listen(3000, '0.0.0.0', () => {
  console.log("Aplicação Iniciada com Sucesso na porta 3000!")
})