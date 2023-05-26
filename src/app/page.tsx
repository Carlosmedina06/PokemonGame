'use client'
import { useRef, useEffect, useMemo } from 'react'

import { Position, Frames } from './types'
import { collisions } from './data/collisions'
import { battleZonesData } from './data/battleZones'

const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const image = useMemo(() => new Image(), [])
  const playerDownImage = useMemo(() => new Image(), [])
  const playerUpImage = useMemo(() => new Image(), [])
  const playerRightImage = useMemo(() => new Image(), [])
  const playerLeftImage = useMemo(() => new Image(), [])
  const foregroundImage = useMemo(() => new Image(), [])

  image.src = '/images/Mapa.png'
  playerDownImage.src = '/images/characterFront.png'
  playerUpImage.src = '/images/characterBack.png'
  playerRightImage.src = '/images/characterRight.png'
  playerLeftImage.src = '/images/characterLeft.png'
  foregroundImage.src = '/images/foregroundObjects.png'

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    if (ctx && canvas) {
      canvas.width = 2000
      canvas.height = 1040

      const collisionsMap = []
      const battleZonesMap = []

      for (let i = 0; i < collisions.length; i += 120) {
        collisionsMap.push(collisions.slice(i, 120 + i))
      }

      for (let i = 0; i < battleZonesData.length; i += 120) {
        battleZonesMap.push(battleZonesData.slice(i, 120 + i))
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
          ctx.fillStyle = 'rgba(255, 0, 0, 5)'
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

      const battleZones: Boundary[] = []

      battleZonesMap.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
          if (col === 15875)
            battleZones.push(
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
        moving?: boolean
        onImageLoad?: () => void
        sprites?: {
          down: HTMLImageElement
          up: HTMLImageElement
          right: HTMLImageElement
          left: HTMLImageElement
        }

        constructor({
          position,
          image,
          frames = { max: 1, val: 0, elapsed: 0 },
          width,
          height,
          onImageLoad,
          sprites,
        }: {
          position: Position
          image: HTMLImageElement
          frames?: Frames
          width?: number
          height?: number
          onImageLoad?: () => void
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
          if (canvas && ctx) {
            ctx.drawImage(
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

      const player = new Sprite({
        position: {
          x: canvas.width / 2 - 143 / 4 / 2,
          y: canvas.height / 2 - 55 / 2,
        },
        image: playerDownImage,
        frames: {
          max: 4,
          val: 0,
          elapsed: 0,
        },
        sprites: {
          up: playerUpImage,
          right: playerRightImage,
          left: playerLeftImage,
          down: playerDownImage,
        },
      })

      const background = new Sprite({
        position: {
          x: offset.x,
          y: offset.y,
        },
        image,
      })

      const foreground = new Sprite({
        position: {
          x: offset.x,
          y: offset.y,
        },
        image: foregroundImage,
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

      const movables = [background, ...boundaries, foreground, ...battleZones]

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
        battleZones.forEach((battleZone) => {
          if (battleZone.draw) battleZone.draw()
        })
        player.draw()
        foreground.draw()

        if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
          for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i]
            const overlappingArea =
              (Math.min(
                player.position.x + player.width,
                battleZone.position.x + battleZone.width,
              ) -
                Math.max(player.position.x, battleZone.position.x)) *
              (Math.min(
                player.position.y + player.height,
                battleZone.position.y + battleZone.height,
              ) -
                Math.max(player.position.y, battleZone.position.y))

            if (
              objectCollides({
                obj1: player,
                obj2: battleZone,
              }) &&
              overlappingArea > (player.width * player.height) / 2 &&
              Math.random() < 0.01
            ) {
              console.log('battle not implemented yet')
              break
            }
          }
        }
        let moving = true

        player.moving = false
        if (keys.w.pressed && lastKey === 'w') {
          player.moving = true
          if (player.sprites) player.image = player.sprites.up
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
          player.moving = true
          if (player.sprites) player.image = player.sprites.left
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
          player.moving = true
          if (player.sprites) player.image = player.sprites.down
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
          player.moving = true
          if (player.sprites) player.image = player.sprites.right
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
  }, [image, foregroundImage, playerUpImage, playerRightImage, playerLeftImage, playerDownImage])

  return (
    <div>
      <canvas ref={canvasRef} height={400} width={400} />
    </div>
  )
}

export default Home
