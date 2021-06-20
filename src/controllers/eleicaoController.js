import Mensagem from "../models/mensagem.js"
import EleicaoService from "../services/eleicaoService.js"
import InfoService from "../services/infoService.js"
import Logger from "../utils/logger.js"
import mensagens from "../utils/mensagens.js"

const eleicaoService = new EleicaoService()
const infoService = new InfoService()

export default class EleicaoController {
  constructor() { }

  getEleicaoAtual(req, resp, next) {
    Logger.info(`Iniciando getEleicaoAtual...`)
    const eleicao = eleicaoService.getEleicaoAtual()
    const myInfo = infoService.getMyInfo()

    const msg = { "tipo_de_eleicao_ativa": myInfo.eleicao, "eleicao_em_andamento": eleicao.ativo }
    resp.body = msg
    
    Logger.info(`getEleicaoAtual finalizado com sucesso!`)
    next()
  }

  iniciaEleicao(req, resp, next) {
    Logger.info(`Iniciando iniciaEleicao...`)
    const eleicao = eleicaoService.getEleicaoAtual()
    if (eleicao.ativo) {
      const msg = new Mensagem(mensagens.eleicao.eleicaoAndamento, false)
      msg.idEleicaoAtual = eleicao.id
      resp.status(409)
      resp.body = msg
      Logger.warn(`iniciaEleicao finalizado com falha!`)
      next()
      
      return
    }

    eleicao.id = req.body.id
    eleicao.ativo = true
    eleicaoService.setEleicaoAtual(eleicao)
    const atraso = 10000
    Logger.info(`Programando finalização de eleição para iniciar em ${atraso / 1000}s`)
    setTimeout(() => eleicaoService.finalizaEleicaoAtual(), atraso)

    const msg = new Mensagem(mensagens.eleicao.eleicaoIniciada, true)
    resp.body = msg
    Logger.info(`iniciaEleicao finalizado com sucesso!`)
    next()
  }

  atualizaCoordenador(req, resp, next) {
    Logger.info(`Iniciando atualizaCoordenador...`)
    infoService.atualizaCoordenador(req.body.coordenador)

    const eleicao = eleicaoService.getEleicaoAtual()
    if (eleicao.ativo && eleicao.id == req.body.id_eleicao) {
      eleicaoService.finalizaEleicaoAtual()
    }

    const msg = new Mensagem(mensagens.eleicao.coordenadorAtualizado, true)
    resp.body = msg
    Logger.info(`atualizaCoordenador finalizado com sucesso!`)
    next()
  }
}