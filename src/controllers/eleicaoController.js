import startEleicao from "../commands/startEleicao.js"
import updateInfo from "../commands/updateInfo.js"
import Mensagem from "../models/mensagem.js"
import EleicaoService from "../services/eleicaoService.js"
import InfoService from "../services/infoService.js"
import Logger from "../utils/logger.js"
import mensagens from "../utils/mensagens.js"
import BaseController from "./baseController.js"

const eleicaoService = new EleicaoService()
const infoService = new InfoService()

export default class EleicaoController extends BaseController {
  constructor() {
    super()
  }

  getEleicaoAtual(req, resp, next) {
    Logger.info(`Iniciando getEleicaoAtual...`)
    const eleicao = eleicaoService.getEleicaoAtual()
    const myInfo = infoService.getMyInfo()

    const msg = { "tipo_de_eleicao_ativa": myInfo.eleicao, "eleicao_em_andamento": eleicao.ativo }
    super.sendResponse(resp, msg, next)
    
    Logger.info(`getEleicaoAtual finalizado com sucesso!`)
  }

  async iniciaEleicao(req, resp, next) {
    Logger.info(`Iniciando iniciaEleicao...`)

    const myInfo = infoService.getMyInfo()
    if (myInfo.eleicao.toLowerCase() !== "valentao" && myInfo.eleicao.toLowerCase() !== "anel") {  
      Logger.error(`Tipo de eleição inválida. Tipo salvo em '/info': ${myInfo.eleicao}!`)

      const msg = new Mensagem(mensagens.eleicao.tipoEleicaoInvalido, true)
      resp.status(400)
      super.sendResponse(resp, msg, next)

      Logger.warn(`iniciaEleicao finalizado com falha!`)
      return
    }

    const eleicao = eleicaoService.getEleicaoAtual()
    if (eleicao.ativo && myInfo.eleicao.toLowerCase() !== "anel") {
      let msg = ""
      if (eleicao.id == req.body.id) {
        Logger.warn(`Eleição de id '${req.body.id}' já está em andamento!`)
        msg = new Mensagem(mensagens.eleicao.eleicaoAndamento, false)
      } else {
        Logger.warn(`Outra eleição de id '${req.body.id}' já está em andamento!`)
        msg = new Mensagem(mensagens.eleicao.outraEleicaoAndamento, false)
      }
      resp.status(409)
      super.sendResponse(resp, msg, next)

      Logger.warn(`iniciaEleicao finalizado com falha!`)
      return
    }

    Logger.info("Chamando UpdateInfo...")
    updateInfo().then(() => {
      Logger.info(`Iniciando processo de eleição...`)
      startEleicao(req.body.id)
    })

    if (!eleicao.ativo) {
      eleicaoService.setEleicaoAtual({ "id": req.body.id, "ativo": true })
    }
    const msg = new Mensagem(mensagens.eleicao.eleicaoIniciada, true)
    super.sendResponse(resp, msg, next)

    Logger.info(`iniciaEleicao finalizado com sucesso!`)
  }

  atualizaCoordenador(req, resp, next) {
    Logger.info(`Iniciando atualizaCoordenador...`)
    infoService.atualizaCoordenador(req.body.coordenador)

    eleicaoService.finalizaEleicaoAtual()

    const msg = new Mensagem(mensagens.eleicao.coordenadorAtualizado, true)
    super.sendResponse(resp, msg, next)

    Logger.info(`atualizaCoordenador finalizado com sucesso!`)
  }
}