import { useState, useEffect } from 'react'
import './App.css'
import { PokemonCard } from './components/PokemonCard'

const API = "https://pokeapi.co/api/v2/"

function App() {
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`${API}/pokemon/pikachu`)
        if (!res.ok) throw new Error(`Pokemin no encontrado ("${res.status}")`)

        const data = await res.json()
        setPokemon(data)
      } catch (err) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetch("https://pokeapi.co/api/v2/pokemon/pikachu")
      .then(res => res.json())
      .then(data => setPokemon(data))
      .finally(setLoading(false))
      .catch(e => setError(e))
  }, [])


  return (
    <>
      <h1>Pokedex</h1>
      {pokemon ? <PokemonCard pokemon={pokemon} /> : <p>Cargando Pokémon...</p>}
    </>
  )
}

export default App
