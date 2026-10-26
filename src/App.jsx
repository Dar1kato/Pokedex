import { useState, useEffect } from 'react'
import { doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore'
import { db } from './firebase'
import { 
        selectPokemon,
        removePokemon,
        writeTeam,
        removeTeam,
        loadPokemon,
        loadTeam
      } 
from './logic/pokemon'
import './App.css'
import { PokemonCard } from './components/PokemonCard'
import { PokemonTeam } from './components/PokemonTeam'

function App() {
  const [pokemon, setPokemon] = useState([])      // Listado de Pokemon obtenidos por el fetch
  const [loading, setLoading] = useState(true)    // Estado de carga de la página
  const [error, setError] = useState(null)        // Estado de error de la página
  const [index, setIndex] = useState(0)           // Numero del offset para el fetch
  const [team, setTeam] = useState([])            // Equipo

  // Llamada a la API
  useEffect(() => {
    async function load() {
      // Banderas de protección
      setLoading(true)
      setError(null)

      // Recuperación de la información
      const { query, error } = await loadPokemon(index)

      setPokemon(query)
      setError(error)
      setLoading(false)
    }

    load()
  }, [index])

  // Query del equipo guardado
  useEffect(() => {
    async function load() {
      const { team: currentTeam, error: currentError } = await loadTeam()

      setTeam(currentTeam)
      if (currentError) setError(currentError)
    }

    load()
  }, [])


  // Funcion para agregar Pokemon al equipo
  function handleSelect(pokemon) {
    const selection = selectPokemon(pokemon, team)
    
    if (!selection) return 

    setTeam([...team, selection])

    writeTeam(pokemon)
  }

  // Función para eliminar Pokemon al equipo
  function handleRemove(pokemon) {
    setTeam(removePokemon(team, pokemon))

    removeTeam(pokemon)
  }

  return (
    <div className='pokedex-page'>
      <div className='pokedex-shell'>
        <h1>Pokedex</h1>
        <main className='pokemon-results'>
          {/* Estatus de error y carga */}
          {loading && <p className='status-message'>Cargando...</p>}
          {error && <p className='status-message error'>{error}</p>}

          {/* Generación de las tarjetas */}
          {pokemon && !loading && !error && (
            <div className='pokemon-grid'>
              {pokemon.map((e) => (
                <PokemonCard key={e.id} pokemon={e} select={handleSelect}/>
              ))}
            </div>
          )}

          {/* Navegación */}
          <nav className='pagination-controls' aria-label='Paginación Pokémon'>
            {/* Los botones aumentan el offset de la API */}
            <button className='pagination-button' disabled={index <= 0} onClick={() => setIndex(index => index - 50 <= 0 ? 0 : index = 1)}>Previous</button>
            <button className='pagination-button' onClick={() => setIndex(index => index + 50)}>Next</button>
          </nav>
        </main>
      </div>

      {/* Listado del qeuipo actual */}
      <PokemonTeam team={team} remove={handleRemove}/>
    </div>
  )
}

export default App 