import Image from 'next/image'

import usePokemonEncounter from '../hooks/usePokemonEncounter'

const PokemonEncounter = () => {
  const pokemon = usePokemonEncounter()

  if (!pokemon) {
    return <div>Loading...</div>
  }

  return (
    <div className="text-black flex justify-around">
      <div className="bg-slate-600 shadow-2xl my-28 rounded-lg border-4 flex flex-col border-gray-950 w-2/4">
        <div className="px-4 py-2">
          <h1 className="text-3xl font-bold">{pokemon.name}</h1>
        </div>
        <div className="flex-1 bg-white px-4 m-4 rounded-lg">
          <div className="h-8 bg-gray-300 m-4 rounded-full">
            <div className="h-full bg-red-500 rounded-full" />
          </div>
        </div>
        <div className="flex justify-end px-4">
          <p className="font-bold">HP: {pokemon.health}</p>
        </div>
      </div>
      <div className="relative">
        <Image alt={pokemon.name} className="" height={400} src={pokemon.image} width={400} />
      </div>
    </div>
  )
}

export default PokemonEncounter
