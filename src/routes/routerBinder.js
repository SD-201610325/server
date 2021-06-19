import EleicaoRouter from "./eleicaoRouter.js"
import InfoRouter from "./infoRouter.js"
import RecursoRouter from "./recursoRouter.js"

const routerBinder = (app) => {
  const infoRouter = new InfoRouter()
  const recursoRouter = new RecursoRouter()
  const eleicaoRouter = new EleicaoRouter()

  app.use('/info', infoRouter.router)
  app.use('/recurso', recursoRouter.router)
  app.use('/eleicao', eleicaoRouter.router)
}

export default routerBinder