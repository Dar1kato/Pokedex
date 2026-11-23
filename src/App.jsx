import { useState, useEffect } from 'react'
import { 
        selectPokemon,
        removePokemon,
      } 
  from './logic/pokemon'
import { 
        loadPokemon
      } 
  from './data/pokemon'
import { 
        writeTeam,
        removeTeam, 
        loadTeam 
      } 
  from './data/team'
import './App.css'
import { PokemonCard } from './components/PokemonCard'
import { PokemonTeam } from './components/PokemonTeam'

function App({ usuario }) {
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
    let active = true

    async function load() {
      const { team: currentTeam, error: currentError } = await loadTeam(usuario.uid)

      if (!active) return
      setTeam(currentTeam)
      if (currentError) setError(currentError)
    }

    load()
    return () => {
      active = false
    }
  }, [usuario.uid])

  async function handleSelect(pokemon) {
    // Obtener la selección de Pokemon
    const selection = selectPokemon(pokemon, team)

    // Prevención de selección nula
    if (!selection) return

    setError(null)
    try {
      await writeTeam(usuario.uid, selection)
      setTeam(currentTeam => [...currentTeam, selection])
    } catch (err) {
      setError(`No se pudo guardar el equipo: ${err.message}`)
    }
  }

  async function handleRemove(pokemon) {
    setError(null)
    try {
      await removeTeam(usuario.uid, pokemon)
      setTeam(currentTeam => removePokemon(currentTeam, pokemon))
    } catch (err) {
      setError(`No se pudo actualizar el equipo: ${err.message}`)
    }
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
            <button className='pagination-button' disabled={index <= 0} onClick={() => setIndex(0)}>&lt;</button>
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