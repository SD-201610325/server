import express from 'express'
import EleicaoController from "../controllers/eleicaoController.js";

export default class EleicaoRouter {
  constructor() {
    const eleicaoController = new EleicaoController()

    this.router = express.Router();

    this.router.route('')
            .get(eleicaoController.getEleicaoAtual)
            .post(eleicaoController.iniciaEleicao)
    this.router.route('/coordenador')
            .post(eleicaoController.atualizaCoordenador)
  }
}