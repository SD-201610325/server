import Logger from "../utils/logger.js"

let myInfo = {
  "componente": "server",
  "descrição": "Serve os clientes com os serviços X, Y e Z",
  "versao": "0.0.3",
  "ponto_de_acesso": "https://sd-app-server-jesulino.herokuapp.com",
  "status": "up",
  "identificacao": 7,
  "lider": 0,
  "eleicao": "valentao",
  "servidores_conhecidos": [
    {
      "id": "",
      "url": "https://sd-201620236.herokuapp.com/"
    },
    {
      "id": "",
      "url": "https://sd-mgs.herokuapp.com/"
    },
    {
      "id": "",
      "url": "https://sd-app-server-jesulino.herokuapp.com"
    }
  ]
}
let coordenadorAtual = undefined

export default class InfoService {
  constructor() { }
  
  getMyInfo() {
    Logger.info(`Consultando myInfo...`)
    Logger.info(`MyInfo consultado com sucesso!`)
    return myInfo
  }

  updateMyInfo(info) {
    Logger.info(`Atualizando myInfo com infos ${JSON.stringify(info)}...`)
    myInfo.status = info.status || myInfo.status
    myInfo.identificacao = info.identificacao ?? myInfo.identificacao
    myInfo.lider = info.lider ?? myInfo.lider
    myInfo.eleicao = info.eleicao || myInfo.eleicao
    Logger.info(`MyInfo atualizado com sucesso!`)

    return myInfo
  }

  getCoordenadorAtual() {
    Logger.info(`Consultando coordenador atual...`)
    const coordenador = coordenadorAtual
    Logger.info(`Coordenador atual consultado com sucesso! Valor: ${JSON.stringify(coordenador)}`)
    return coordenador
  }

  atualizaCoordenador(idCoordenador) {
    Logger.info(`Atualizando coordenador atual com id '${JSON.stringify(idCoordenador)}'...`)
    coordenadorAtual = idCoordenador
    Logger.info(`Coordenador atual atualizado com sucesso!`)
  }
}