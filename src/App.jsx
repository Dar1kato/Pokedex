import { useState, useEffect } from 'react'
import './App.css'
import { PokemonCard } from './components/PokemonCard'

const API = "https://pokeapi.co/api/v2/"

function App() {
  const [pokemon, setPokemon] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      // Banderas de protección
      setLoading(true)
      setError(null)

      try {
        // Fetch de n pokemon con su respectivo offset
        const res = await fetch(`${API}pokemon/?limit=20&offset=20`)

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
  }, [])

  const handleNumberChange = (e) => {
    const val = e.taget.value;

    setNumber(val === '' ? 20 : Number(val));
  };

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
    </>
  )
}

export default App
