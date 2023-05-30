'use client'

import Image from 'next/image'

import PokemonEncounter from './PokemonEncounter'

export const Battle = () => {
  return (
    <div className="relative">
      <div className="absolute top-10 w-11/12 mx-6">
        <PokemonEncounter />
      </div>
      <Image
        alt="battlebackground"
        height={window.innerHeight}
        src={'/images/battleBackground.png'}
        width={window.innerWidth}
      />
    </div>
  )
}
