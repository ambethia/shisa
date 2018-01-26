import testStroke from './testStroke'

class DrawSurface {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.isDrawing = false
    this.stroke = testStroke
    this.now = 0
    canvas.onpointerdown = this._down
    canvas.onpointermove = this._move
    canvas.onpointerup = this._up

    requestAnimationFrame(this._update)
  }

  _update = () => {
    this.draw()
    requestAnimationFrame(this._update)
  }

  _down = event => {
    this.isDrawing = true
    const x = event.offsetX
    const y = event.offsetY
    const p = event.pressure
    const t = 0
    this.stroke = [{ x, y, p, t }]
    this.now = Date.now()
  }

  _up = event => {
    this.isDrawing = false
    this.stroke = []
  }

  _move = event => {
    if (this.isDrawing) {
      event.getCoalescedEvents().forEach(e => {
        const x = e.offsetX
        const y = e.offsetY
        const p = e.pressure
        const t = Date.now() - this.now
        this.stroke.push({ x, y, p, t })
      })
    }
  }

  draw() {
    const color = 'red'
    const { ctx, stroke } = this
    // for (let i = 0; i < stroke.length; i++) {
    //   const size = 2
    //   const { x, y, p } = stroke[i]
    //   ctx.fillStyle = `hsl(0,0%,${Math.round((1 - p) * 100)}%)`
    //   ctx.fillRect(x, y, size, size)
    // }

    const maxWidth = 4 // TODO configurable brush size
    const minWidth = maxWidth * 0.1
    if (stroke.length > 0) {
      const outline = []
      // TODO: Refacter this when stroke point handling is converted from objects to arrays
      outline.push([stroke[0].x, stroke[0].y])
      for (let i = 1; i < stroke.length; i++) {
        // this point
        const x0 = stroke[i].x
        const y0 = stroke[i].y
        // previous point
        const x1 = stroke[i - 1].x
        const y1 = stroke[i - 1].y
        // direction & magnitude
        const dx = x1 - x0
        const dy = y1 - y0
        const magnatude = Math.sqrt(dx * dx + dy * dy)
        // velocity with some
        const t0 = stroke[i].t
        const t1 = stroke[i - 1].t
        let velocity = t0 === t1 ? magnatude / t0 : 0
        // Apply some cubic easing to the pressure
        let p = stroke[i].p
        p = p < 0.5 ? 4 * p * p * p : (p - 1) * (2 * p - 2) * (2 * p - 2) + 1
        // normalize the vector based on pressure and velocity
        const weight = Math.max(maxWidth / (velocity + 1) * p, minWidth)
        const nx = dx * weight / magnatude
        const ny = dy * weight / magnatude
        // Use the normalized vector to find points
        // perpendicular to the center line at the
        // midpoint between it's two two points
        const x2 = (x0 + x1) / 2 - ny
        const y2 = (y0 + y1) / 2 + nx
        const x3 = (x0 + x1) / 2 + ny
        const y3 = (y0 + y1) / 2 - nx
        // TODO: Refactor to use pre-allocated array rather than resizing for every point.
        outline.unshift([x2, y2])
        outline.push([x3, y3])
        if (i === stroke.length - 1) {
          outline.push([x0, y0])
        }
      }
      if (outline.length > 1) {
        ctx.beginPath()
        ctx.fillStyle = color
        ctx.moveTo(outline[0][0], outline[0][1])
        for (let i = 1; i < outline.length - 2; i++) {
          var xc = (outline[i][0] + outline[i + 1][0]) / 2
          var yc = (outline[i][1] + outline[i + 1][1]) / 2
          ctx.quadraticCurveTo(outline[i][0], outline[i][1], xc, yc)
        }
        ctx.quadraticCurveTo(
          outline[1][0],
          outline[1][1],
          outline[0][0],
          outline[0][1]
        )
        ctx.fill()
      }
    }
  }
}

export default DrawSurface
