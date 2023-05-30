'use client'

import Image from 'next/image'
import { useState } from 'react'

import useStarterPokemon from '../hooks/useStarterPokemon'

export const starterPokemon = ['bulbasaur', 'squirtle', 'charmander']

const PokemonSelector = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { pokemonList, selectedPokemon, handleSelectPokemon } = useStarterPokemon()

  const handleConfirmation = () => {
    setShowConfirmation(true)
  }

  const handleCancel = () => {
    setShowConfirmation(false)
  }

  const handleAccept = () => {
    setIsOpen(false)
  }

  if (!isOpen) {
    return null
  }

  if (selectedPokemon && showConfirmation) {
    return (
      <div className="fixed flex-col inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
        <div className="mt-4">
          <h3 className="text-xl font-bold text-white">Has seleccionado:</h3>
          <p className="text-white">{selectedPokemon.name}</p>
          <Image
            alt={selectedPokemon.name}
            className="mt-2 border-2 border-white rounded-full p-2 bg-white"
            height={100}
            src={selectedPokemon.sprite}
            width={100}
          />
        </div>
        <div className="mt-4">
          <p className="text-white">¿Estás seguro de tu elección?</p>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={handleAccept}
          >
            Aceptar
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed flex-col inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
      <h2 className="text-2xl font-bold mb-4 text-white">Selecciona un Pokémon inicial</h2>
      <ul className="flex space-x-4">
        {pokemonList
          .filter((pokemon) => starterPokemon.includes(pokemon.name))
          .map((pokemon) => (
            <li key={pokemon.name} className="flex flex-col items-center space-x-2">
              <Image
                alt={pokemon.name}
                className="border-2 border-white rounded-full p-2 bg-white"
                height={100}
                // eslint-disable-next-line prettier/prettier
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png`}
                width={100}
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                onClick={() => {
                  handleSelectPokemon(pokemon)
                  handleConfirmation()
                }}
              >
                {pokemon.name}
              </button>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default PokemonSelector
