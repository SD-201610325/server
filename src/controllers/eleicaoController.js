import startEleicao from "../commands/startEleicao.js"
import updateInfo from "../commands/updateInfo.js"
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
      let msg = ""
      if (eleicao.id == req.body.id) {
        Logger.warn(mensagens.eleicao.eleicaoAndamento)
        msg = new Mensagem(mensagens.eleicao.eleicaoAndamento, false)
      } else {
        Logger.warn(mensagens.eleicao.outraEleicaoAndamento)
        msg = new Mensagem(mensagens.eleicao.outraEleicaoAndamento, false)
      }
      resp.body = msg
      Logger.info(`iniciaEleicao finalizado com falha!`)
      next()
      return
    }

    eleicaoService.setEleicaoAtual({ "id": req.body.id, "ativo": true })

    Logger.info("Chamando UpdateInfo...")
    updateInfo().then(() => {
      Logger.info(`Iniciando processo de eleição...`)
      startEleicao(req.body.id)
    })

    const msg = new Mensagem(mensagens.eleicao.eleicaoIniciada, true)
    resp.body = msg
    Logger.info(`iniciaEleicao finalizado com sucesso!`)
    next()
  }

  atualizaCoordenador(req, resp, next) {
    Logger.info(`Iniciando atualizaCoordenador...`)
    infoService.atualizaCoordenador(req.body.coordenador)

    eleicaoService.finalizaEleicaoAtual()

    const msg = new Mensagem(mensagens.eleicao.coordenadorAtualizado, true)
    resp.body = msg
    Logger.info(`atualizaCoordenador finalizado com sucesso!`)
    next()
  }
}