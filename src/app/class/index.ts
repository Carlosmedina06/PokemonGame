import { Frames, Position } from '../types'

export class Boundary {
  static width = 48
  static height = 48
  position: Position
  width: number
  height: number
  ctx: CanvasRenderingContext2D
  constructor({ position, ctx }: { position: Position; ctx: CanvasRenderingContext2D }) {
    this.position = position
    this.width = 48
    this.height = 48
    this.ctx = ctx
  }

  draw?() {
    if (!this.ctx) return
    this.ctx.fillStyle = 'rgba(255, 0, 0, 0)'
    this.ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}

export class Sprite {
  position: Position
  image: HTMLImageElement
  frames: Frames
  width: number
  height: number
  moving?: boolean
  onImageLoad?: () => void
  ctx?: CanvasRenderingContext2D
  sprites?: {
    down: HTMLImageElement
    up: HTMLImageElement
    right: HTMLImageElement
    left: HTMLImageElement
  }
  canvas: HTMLCanvasElement

  constructor({
    position,
    image,
    frames = { max: 1, val: 0, elapsed: 0 },
    width,
    height,
    onImageLoad,
    sprites,
    ctx,
    canvas,
  }: {
    position: Position
    image: HTMLImageElement
    frames?: Frames
    width?: number
    height?: number
    onImageLoad?: () => void
    ctx: CanvasRenderingContext2D
    canvas: HTMLCanvasElement
    sprites?: {
      up: HTMLImageElement
      right: HTMLImageElement
      left: HTMLImageElement
      down: HTMLImageElement
    }
  }) {
    this.position = position
    this.image = image
    this.frames = frames
    this.width = width || 0
    this.height = height || 0
    this.onImageLoad = onImageLoad
    this.ctx = ctx
    this.canvas = canvas
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
      if (this.onImageLoad) {
        this.onImageLoad()
      }
      this.moving = false
      this.sprites = sprites
    }
  }

  draw() {
    if (this.canvas && this.ctx) {
      this.ctx.drawImage(
        this.image,
        this.frames.val * this.width,
        0,
        this.image.width / this.frames.max,
        this.image.height,
        this.position.x,
        this.position.y,
        this.image.width / this.frames.max,
        this.image.height,
      )
      if (!this.moving) return
      if (this.frames.max > 1) this.frames.elapsed++
      if (this.frames.elapsed % 10 === 0) {
        if (this.frames.val < this.frames.max - 1) this.frames.val++
        else this.frames.val = 0
      }
    }
  }
}
