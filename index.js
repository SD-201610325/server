'use strict';

import express from 'express'

const app = express()
app.use(express.json())

var ocupado = false

app.get('/info', (req, resp) => {
  const result = {
    "componente": "server",
    "descrição": "Serve os clientes com os serviços X, Y e Z",
    "versao": "0.1"
  }
  resp.send(result)
})

app.post('/recurso', (req, resp) => {
  if (ocupado) {
    resp.status(409)
    resp.send({ 'message': 'Recurso indisponível no momento. Tente novamente mais tarde.'})
  } else {
    ocupado = true
    setTimeout(() => ocupado = false, 10000)
    resp.send({ 'message': 'Recurso alocado com sucesso!'});
  }
})

const server = app.listen(3000, '0.0.0.0', () => {
  console.log("Aplicação Iniciada com Sucesso na porta 3000!")
})