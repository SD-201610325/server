'use strict';

import express from 'express'

const app = express()
app.use(express.json())

var ocupado = false
var myInfo = {
  "componente": "server",
  "descrição": "Serve os clientes com os serviços X, Y e Z",
  "versao": "0.2",
  "ponto_de_acesso": "http://sd-app-server-jesulino.herokuapp.com",
  "status": "up",
  "identificacao": 7,
  "lider": 0,
  "eleicao": "valentao",
  "servidores_conhecidos": []
}
var infos = []
var coordenadorAtual = undefined
var eleicao = {
  "id": undefined,
  "ativo": false
}

app.get('/info', (req, resp) => {
  resp.send(myInfo)
})

app.post('/info', (req, resp) => {
  myInfo.status = req.body.status || myInfo.status
  myInfo.identificacao = req.body.identificacao ?? myInfo.identificacao
  myInfo.lider = req.body.lider ?? myInfo.lider
  myInfo.eleicao = req.body.eleicao || myInfo.eleicao
  resp.send({ "mensagem": "Info atualizada com sucesso!", "novaInfo": myInfo })
})

app.get('/recurso', (req, resp) => {
  resp.send({ "ocupado": ocupado })
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

app.get('/eleicao', (req, resp) => {
  resp.send({ "tipo_de_eleicao_ativa": myInfo.eleicao, "eleicao_em_andamento": eleicao.ativo })
})

app.post('/eleicao', (req, resp) => {
  eleicao.id = req.body.id
  eleicao.ativo = true
  setTimeout(() => eleicao.ativo = false, 10000)
  resp.send({ "message": "Eleição iniciada!" })
})

app.post('/eleicao/coordenador', (req, resp) => {
  coordenadorAtual = req.body.coordenador
  resp.send({ "message": "Coordenador atualizado!" })
})

const port = process.argv[2]
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Aplicação Iniciada com Sucesso na porta ${port}!`)
})