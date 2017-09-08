import React, { Component } from 'react'

class Canvas extends Component {
  render() {
    return (
      <div className="Canvas">
        <canvas ref="draw" />
      </div>
    )
  }
}

export default Canvas
