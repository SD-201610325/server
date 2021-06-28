export default class BaseController {
  constructor() { }

  sendResponse(res, body, next) {
    res.body = body
    res.send(res.body)
    next()
  }
}