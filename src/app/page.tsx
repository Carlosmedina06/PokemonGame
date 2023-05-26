'use client'
import { useRef, useEffect, useMemo } from 'react'

import { Position, Frames } from './types'
import { collisions } from './data/collisions'

const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const image = useMemo(() => new Image(), [])
  const playerImage = useMemo(() => new Image(), [])

  image.src = '/images/Mapa.png'
  playerImage.src = '/images/characterFront.png'

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    if (ctx && canvas) {
      canvas.width = 2000
      canvas.height = 1040

      const collisionsMap = []

      for (let i = 0; i < collisions.length; i += 120) {
        collisionsMap.push(collisions.slice(i, 120 + i))
      }

      class Boundary {
        static width = 48
        static height = 48
        position: Position
        width: number
        height: number
        constructor({ position }: { position: Position }) {
          this.position = position
          this.width = 48
          this.height = 48
        }

        draw?() {
          if (!ctx) return
          ctx.fillStyle = 'rgba(255, 0, 0, 0)'
          ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        }
      }

      const boundaries: Boundary[] = []

      const offset = {
        x: -1570,
        y: -1920,
      }

      collisionsMap.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
          if (col === 15875)
            boundaries.push(
              new Boundary({
                position: {
                  x: colIndex * Boundary.width + offset.x,
                  y: rowIndex * Boundary.height + offset.y,
                },
              }),
            )
        })
      })

      class Sprite {
        position: Position
        image: HTMLImageElement
        frames: Frames
        width: number
        height: number
        onImageLoad: (() => void) | undefined

        constructor({
          position,
          image,
          frames = { max: 1 },
          width,
          height,
          onImageLoad,
        }: {
          position: Position
          image: HTMLImageElement
          frames?: Frames
          width?: number
          height?: number
          onImageLoad?: () => void
        }) {
          this.position = position
          this.image = image
          this.frames = frames
          this.width = width || 0
          this.height = height || 0
          this.onImageLoad = onImageLoad

          this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
            if (this.onImageLoad) {
              this.onImageLoad()
            }
          }
        }

        draw() {
          if (canvas && ctx) {
            ctx.drawImage(
              this.image,
              0,
              0,
              this.image.width / this.frames.max,
              this.image.height,
              this.position.x,
              this.position.y,
              this.image.width / this.frames.max,
              this.image.height,
            )
          }
        }
      }

      const player = new Sprite({
        position: {
          x: canvas.width / 2 - 143 / 4 / 2,
          y: canvas.height / 2 - 55 / 2,
        },
        image: playerImage,
        frames: {
          max: 4,
        },
      })

      const background = new Sprite({
        position: {
          x: offset.x,
          y: offset.y,
        },
        image,
      })

      const keys = {
        w: {
          pressed: false,
        },
        a: {
          pressed: false,
        },
        s: {
          pressed: false,
        },
        d: {
          pressed: false,
        },
      }

      const movables = [background, ...boundaries]

      const objectCollides = ({ obj1, obj2 }: { obj1: Sprite; obj2: Boundary }) => {
        return (
          obj1.position.x + obj1.width >= obj2.position.x &&
          obj1.position.x <= obj2.position.x + obj2.width &&
          obj1.position.y <= obj2.position.y + obj2.height &&
          obj1.position.y + obj1.height >= obj2.position.y
        )
      }

      const animate = () => {
        window.requestAnimationFrame(animate)
        background.draw()
        boundaries.forEach((boundary) => {
          if (boundary.draw) boundary.draw()
        })

        player.draw()
        let moving = true

        if (keys.w.pressed && lastKey === 'w') {
          for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]

            if (
              objectCollides({
                obj1: player,
                obj2: {
                  ...boundary,
                  position: {
                    x: boundary.position.x,
                    y: boundary.position.y + 3,
                  },
                },
              })
            ) {
              moving = false
              break
            }
          }
          if (moving)
            movables.forEach((movable) => {
              movable.position.y += 3
            })
        }
        if (keys.a.pressed && lastKey === 'a') {
          for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]

            if (
              objectCollides({
                obj1: player,
                obj2: {
                  ...boundary,
                  position: {
                    x: boundary.position.x + 3,
                    y: boundary.position.y,
                  },
                },
              })
            ) {
              moving = false
              break
            }
          }
          if (moving)
            movables.forEach((movable) => {
              movable.position.x += 3
            })
        }
        if (keys.s.pressed && lastKey === 's') {
          for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]

            if (
              objectCollides({
                obj1: player,
                obj2: {
                  ...boundary,
                  position: {
                    x: boundary.position.x,
                    y: boundary.position.y - 3,
                  },
                },
              })
            ) {
              moving = false
              break
            }
          }
          if (moving)
            movables.forEach((movable) => {
              movable.position.y -= 3
            })
        }
        if (keys.d.pressed && lastKey === 'd') {
          for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]

            if (
              objectCollides({
                obj1: player,
                obj2: {
                  ...boundary,
                  position: {
                    x: boundary.position.x - 3,
                    y: boundary.position.y,
                  },
                },
              })
            ) {
              moving = false
              break
            }
          }
          if (moving)
            movables.forEach((movable) => {
              movable.position.x -= 3
            })
        }
      }

      animate()

      let lastKey = ''

      window.addEventListener('keydown', ({ key }) => {
        switch (key) {
          case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
          case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
          case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
          case 'd':
            keys.d.pressed = true
            lastKey = 'd'
        }
      })

      window.addEventListener('keyup', ({ key }) => {
        switch (key) {
          case 'w':
            keys.w.pressed = false
            break
          case 'a':
            keys.a.pressed = false
            break
          case 's':
            keys.s.pressed = false
            break
          case 'd':
            keys.d.pressed = false
            break
        }
      })
    }
  }, [image, playerImage])

  return (
    <div>
      <canvas ref={canvasRef} height={400} width={400} />
    </div>
  )
}

export default Home
