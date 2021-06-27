const notFoundHandler = (req, res, next) => {
  if (res.headersSent) {
    next()
    return
  }

  res.status(404).send()
  next()
}

export default notFoundHandler