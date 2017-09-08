class DrawSurface {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.bindEvents()
  }

  bindEvents() {}
}

export default DrawSurface
