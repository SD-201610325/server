import express from 'express'
import RecursoController from '../controllers/recursoController.js';

export default class RecursoRouter {
  constructor() {
    const recursoController = new RecursoController

    this.router = express.Router();

    this.router.route('')
            .get(recursoController.getRecurso)
            .post(recursoController.requisitarRecurso)
  }
}