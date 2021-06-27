export default class BaseController {
  constructor() { }

  sendResponse(res, body) {
    res.body = body
    res.send(res.body)
  }
}