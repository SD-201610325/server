import InfoService from "../services/infoService.js"
import mensagens from "../utils/mensagens.js"

const infoService = new InfoService()

export default class InfoController {
  constructor() { }
  
  getMyInfo(req, resp) {
    const myInfo = infoService.getMyInfo()
    resp.send(myInfo)
  }

  updateMyInfo(req, resp) {
    const novaInfo = infoService.updateMyInfo(req.body)

    const resposta = {
      "mensagem": mensagens.info.infoAtualizada,
      "novaInfo": novaInfo
    }
    resp.send(resposta)
  }
}