import Mensagem from "../models/mensagem.js"
import EleicaoService from "../services/eleicaoService.js"
import InfoService from "../services/infoService.js"
import mensagens from "../utils/mensagens.js"

const eleicaoService = new EleicaoService()
const infoService = new InfoService()

export default class EleicaoController {
  constructor() { }

  getEleicaoAtual(req, resp) {
    const eleicao = eleicaoService.getEleicaoAtual()
    const myInfo = infoService.getMyInfo()

    const msg = { "tipo_de_eleicao_ativa": myInfo.eleicao, "eleicao_em_andamento": eleicao.ativo }
    resp.send(msg)
  }

  iniciaEleicao(req, resp) {
    const eleicao = eleicaoService.getEleicaoAtual()
    if (eleicao.ativo) {
      const msg = new Mensagem(mensagens.eleicao.eleicaoAndamento, false)
      msg.idEleicaoAtual = eleicao.id
      resp.status(409)
      resp.send(msg)

      return
    }

    eleicao.id = req.body.id
    eleicao.ativo = true
    eleicaoService.setEleicaoAtual(eleicao)
    setTimeout(() => eleicaoService.finalizaEleicaoAtual(), 10000)

    const msg = new Mensagem(mensagens.eleicao.eleicaoIniciada, true)
    resp.send(msg)
  }

  atualizaCoordenador(req, resp) {
    infoService.atualizaCoordenador(req.body.coordenador)

    const eleicao = eleicaoService.getEleicaoAtual()
    if (eleicao.ativo && eleicao.id == req.body.id_eleicao) {
      eleicaoService.finalizaEleicaoAtual()
    }

    const msg = new Mensagem(mensagens.eleicao.coordenadorAtualizado, true)
    resp.send(msg)
  }
}