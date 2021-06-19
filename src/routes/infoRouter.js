import express from 'express'
import InfoController from '../controllers/infoController.js';

export default class InfoRouter {
  constructor() {
    const infoController = new InfoController()

    this.router = express.Router();

    this.router.route('')
            .get(infoController.getMyInfo)
            .post(infoController.updateMyInfo)
  }
}