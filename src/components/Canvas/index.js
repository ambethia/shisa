import React, { Component } from 'react'
import DrawSurface from './DrawSurface'

class Canvas extends Component {
  componentDidMount() {
    this.drawSurface = new DrawSurface(this.refs.draw)
    this.refs.draw.width = 600
    this.refs.draw.height = 600
  }

  render() {
    return (
      <div className="Canvas">
        <canvas ref="draw" />
      </div>
    )
  }
}

export default Canvas
