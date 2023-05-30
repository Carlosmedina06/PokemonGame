import axios from 'axios'
import { useEffect, useState } from 'react'

interface PokemonEncounter {
  name: string
  image: string
  attacks: string[]
  health: number
}

const usePokemonEncounter = () => {
  const [pokemon, setPokemon] = useState<PokemonEncounter | null>(null)

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon')
        const results = response.data.results
        const randomIndex = Math.floor(Math.random() * results.length)
        const randomPokemon = results[randomIndex]

        const pokemonResponse = await axios.get(randomPokemon.url)
        const { name, sprites, moves, stats } = pokemonResponse.data
        const image = sprites.front_default
        const attacks = moves.map((move: any) => move.move.name)
        const health = stats.find((stat: any) => stat.stat.name === 'hp').base_stat

        const newPokemon: PokemonEncounter = {
          name,
          image,
          attacks,
          health,
        }

        setPokemon(newPokemon)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching Pokemon:', error)
      }
    }

    fetchPokemon()
  }, [])

  return pokemon
}

export default usePokemonEncounter
