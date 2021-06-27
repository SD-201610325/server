import Logger from "../utils/logger.js"

let myInfo = {
  "componente": "server",
  "descrição": "Serve os clientes com os serviços X, Y e Z",
  "versao": process.env.npm_package_version,
  "ponto_de_acesso": "https://sd-app-server-jesulino.herokuapp.com",
  "status": "up",
  "identificacao": 4,
  "lider": 0,
  "eleicao": "valentao",
  "servidores_conhecidos": [
    {
      "id": "1",
      "url": "https://sd-201620236.herokuapp.com"
    },
    {
      "id": "2",
      "url": "https://sd-mgs.herokuapp.com"
    },
		{
      "id": "3",
      "url": "https://sd-jhsq.herokuapp.com"
    },
		{
      "id": "4",
      "url": "https://sd-rdm.herokuapp.com"
    },
		{
      "id": "5",
      "url": "https://sd-dmss.herokuapp.com"
    }
  ]
}
let coordenadorAtual = undefined
let othersInfo = []

export default class InfoService {
  constructor() { }
  
  getMyInfo() {
    Logger.info(`Consultando myInfo...`)
    const info = myInfo
    Logger.info(`MyInfo consultado com sucesso! Valor: ${JSON.stringify(info)}`)
    return info
  }

  updateMyInfo(info) {
    Logger.info(`Atualizando myInfo com infos ${JSON.stringify(info)}...`)
    myInfo.status = info.status || myInfo.status
    myInfo.identificacao = info.identificacao ?? myInfo.identificacao
    myInfo.lider = info.lider ?? myInfo.lider
    myInfo.eleicao = info.eleicao || myInfo.eleicao
    myInfo.servidores_conhecidos = info.servidores_conhecidos ?? myInfo.servidores_conhecidos
    Logger.info(`MyInfo atualizada com sucesso!`)

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

  getOthersInfo() {
    Logger.info(`Consultando info atual dos servidores conhecidos...`)
    const infos = othersInfo
    Logger.info(`Info atual dos servidores conhecidos obtida com sucesso! Valor: ${JSON.stringify(infos)}`)
    return infos
  }

  setOthersInfo(infos) {
    Logger.info(`Salvando info atual dos servidores conhecidos com valor '${JSON.stringify(infos)}'...`)
    othersInfo = infos
    Logger.info(`Info atual dos servidores conhecidos salva com sucesso!`)
  }

  setOtherInfo(id, info) {
    Logger.info(`Atualizando info atual dos servidores conhecidos com valor '${JSON.stringify(infos)}'...`)
    const other = othersInfo.find(o => o.id === id)
    Object.assign(other, info)
    Logger.info(`Info atual dos servidores conhecidos atualizada com sucesso!`)
  }
}