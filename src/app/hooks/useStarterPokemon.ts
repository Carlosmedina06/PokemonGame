import { useEffect, useState } from 'react'

export type Pokemon = {
  name: string
  url: string
}

export type PokemonDetails = {
  name: string
  sprite: string
}

const useStarterPokemon = (): {
  pokemonList: Pokemon[]
  selectedPokemon: PokemonDetails | null
  handleSelectPokemon: (pokemon: Pokemon) => void
} => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([])
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null)

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=9')
        const data = await response.json()

        setPokemonList(data.results)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Error fetching Pokemon:', error)
      }
    }

    fetchPokemon()
  }, [])

  const fetchPokemonDetails = async (pokemon: Pokemon) => {
    try {
      const response = await fetch(pokemon.url)
      const data = await response.json()
      const pokemonDetails: PokemonDetails = {
        name: data.name,
        sprite: data.sprites.front_default,
      }

      setSelectedPokemon(pokemonDetails)
      localStorage.setItem('selectedPokemon', JSON.stringify(pokemonDetails))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error fetching Pokemon details:', error)
    }
  }

  const handleSelectPokemon = (pokemon: Pokemon) => {
    fetchPokemonDetails(pokemon)
  }

  return {
    pokemonList,
    selectedPokemon,
    handleSelectPokemon,
  }
}

export default useStarterPokemon
