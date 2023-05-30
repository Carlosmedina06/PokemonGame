'use client'
import { useRef, useEffect, useMemo, useState } from 'react'
import { gsap } from 'gsap'

import { collisions } from './data/collisions'
import { battleZonesData } from './data/battleZones'
import { Boundary, Sprite } from './class'
import { Battle } from './components/Battle'
import Bag from './components/Bag'
import PokemonSelector from './components/PokemonSelector'

const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const image = useMemo(() => new Image(), [])
  const playerDownImage = useMemo(() => new Image(), [])
  const playerUpImage = useMemo(() => new Image(), [])
  const playerRightImage = useMemo(() => new Image(), [])
  const playerLeftImage = useMemo(() => new Image(), [])
  const foregroundImage = useMemo(() => new Image(), [])
  const battleBackgroundImage = useMemo(() => new Image(), [])
  const [fondo, setFondo] = useState(false)

  image.src = '/images/Mapa.png'
  playerDownImage.src = '/images/characterFront.png'
  playerUpImage.src = '/images/characterBack.png'
  playerRightImage.src = '/images/characterRight.png'
  playerLeftImage.src = '/images/characterLeft.png'
  foregroundImage.src = '/images/foregroundObjects.png'
  battleBackgroundImage.src = '/images/battleBackground.png'

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
                ctx,
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
                ctx,
              }),
            )
        })
      })

      // Sprites
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
        ctx,
        canvas,
      })

      const background = new Sprite({
        position: {
          x: offset.x,
          y: offset.y,
        },
        image,
        canvas,
        ctx,
      })

      const foreground = new Sprite({
        position: {
          x: offset.x,
          y: offset.y,
        },
        image: foregroundImage,
        canvas,
        ctx,
      })

      // Keyboard press
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

      // objects moving
      const movables = [background, ...boundaries, foreground, ...battleZones]

      // Collisions
      const objectCollides = ({ obj1, obj2 }: { obj1: Sprite; obj2: Boundary }) => {
        return (
          obj1.position.x + obj1.width >= obj2.position.x &&
          obj1.position.x <= obj2.position.x + obj2.width &&
          obj1.position.y <= obj2.position.y + obj2.height &&
          obj1.position.y + obj1.height >= obj2.position.y
        )
      }

      const battle = {
        initiated: false,
      }

      const animate = () => {
        const animationId = window.requestAnimationFrame(animate)

        // pinto el fondo
        background.draw()
        // pinto los boundaries
        boundaries.forEach((boundary) => {
          if (boundary.draw) boundary.draw()
        })
        battleZones.forEach((battleZone) => {
          if (battleZone.draw) battleZone.draw()
        })
        // pinto el player
        player.draw()
        // pinto el foreground
        foreground.draw()

        let moving = true

        player.moving = false

        if (battle.initiated) return
        // Battle zone encounter
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
              window.cancelAnimationFrame(animationId)
              battle.initiated = true
              gsap.to('#overlappingDiv', {
                opacity: 1,
                repeat: 3,
                yoyo: true,
                duration: 0.4,
                onComplete: () => {
                  gsap.to('#overlappingDiv', {
                    opacity: 1,
                    duration: 0.4,
                    onComplete: () => {
                      setFondo(true)
                      // animateBattle()
                      gsap.to('#overlappingDiv', {
                        opacity: 0,
                        duration: 0.4,
                      })
                    },
                  })
                },
              })
              break
            }
          }
        }

        // Movimiento
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

      // Iniciar animación
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
  }, [
    image,
    foregroundImage,
    playerUpImage,
    playerRightImage,
    playerLeftImage,
    playerDownImage,
    battleBackgroundImage,
  ])

  return (
    <div className="inline-block relative">
      {!fondo && <PokemonSelector />}
      {!fondo && <Bag />}
      <div
        className=" bg-black top-0 right-0 bottom-0 left-0 absolute opacity-0 pointer-events-none"
        id="overlappingDiv"
      />
      {fondo && <Battle />}
      <canvas ref={canvasRef} height={1440} width={1080} />
    </div>
  )
}

export default Home
