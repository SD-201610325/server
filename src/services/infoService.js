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
    return myInfo
  }

  updateMyInfo(info) {
    myInfo.status = info.status || myInfo.status
    myInfo.identificacao = info.identificacao ?? myInfo.identificacao
    myInfo.lider = info.lider ?? myInfo.lider
    myInfo.eleicao = info.eleicao || myInfo.eleicao

    return myInfo
  }

  getCoordenadorAtual() {
    return coordenadorAtual
  }

  atualizaCoordenador(idCoordenador) {
    coordenadorAtual = idCoordenador
    if (myInfo.identificacao != idCoordenador) {
      myInfo.lider = 0
    } else {
      myInfo.lider = 1
    }
  }
}