import { useState, useEffect } from 'react'
import './App.css'
import { PokemonCard } from './components/PokemonCard'

const API = "https://pokeapi.co/api/v2/"

function App() {
  const [pokemon, setPokemon] = useState([])      // Listado de Pokemon obtenidos por el fetch
  const [loading, setLoading] = useState(true)    // Estado de carga de la página
  const [error, setError] = useState(null)        // Estado de error de la página
  const [index, setIndex] =useState(0)            // Numero del offset para el fetch

  useEffect(() => {
    async function load() {
      // Banderas de protección
      setLoading(true)
      setError(null)

      try {
        // Fetch de 50 pokemon con {index} como offset
        const res = await fetch(`${API}pokemon/?limit=50&offset=${index}`)

        // Detección de errores en el fetch general
        if (!res.ok) throw new Error(`Error en el fetch ("${res.status}")`)
        
        // Codigo generado con IA para el manejo de las URLs obtenidas por el fetch general de la API
        const { results } = await res.json()
        const details = await Promise.all(
          results.map(async ({ url }) => {
            const response = await fetch(url)
            if (!response.ok) throw new Error(`Error en el fetch ("${response.status}")`)
            return response.json()
          })
        )

        // Actualizamos la lista de Pokemon
        setPokemon(details)

      // Manejo de errores
      } catch (err) {
        setError(err.message)

      // Termino de la ejecución, finaliza el loading state
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [index]) // El index es el offset en el fetch del API

  return (
    <>
      <h1>Pokedex</h1>
      <br />
      {loading && <p>Cargando...</p>}
      {error && <p className='error'>{error}</p>}

      {/* Generación procedural de las tarjetas */}
      {pokemon && !loading && !error && pokemon.map((e) => (
        <PokemonCard key={e.id} pokemon={e} />
      ))}

      <nav className='pagination-controls' aria-label='Paginación Pokémon'>
        {/* Los botones aumentan el offset de la API */}
        <button className='pagination-button' onClick={() => setIndex(index => index - 500 <= 0 ? 0 : index = 1)}>Previous</button>
        <button className='pagination-button' onClick={() => setIndex(index => index + 50)}>Next</button>
      </nav>
    </>
  )
}

export default App
