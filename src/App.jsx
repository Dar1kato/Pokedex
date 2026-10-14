import { useState, useEffect } from 'react'
import { doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore'
import { db } from './firebase'
import './App.css'
import { PokemonCard } from './components/PokemonCard'
import { PokemonTeam } from './components/PokemonTeam'

const API = "https://pokeapi.co/api/v2/"

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


  // Query del equipo guardado
  useEffect(() => {
    getDocs(collection(db, 'equipo'))
      .then((snap) => 
        setTeam(snap.docs.map((data) => data.data().pokemon).filter(Boolean))
      )
      .catch((e) => setError(e.message))
  }, [])


  // Funcion para agregar Pokemon al equipo
  async function select(pokemon) {
    if (team.length == 6) return
    if (team.some((e) => e.id === pokemon.id)) return
    
    setTeam([...team, pokemon]);

    try {
      await setDoc(doc(db, 'equipo', String(pokemon.id)), {
        pokemon: pokemon
      })
    } catch (err) {
      console.log(err)
    }
  }

  const remove = async (pokemon) => {
    setTeam(team.filter((e) => e !== pokemon))

    try {
      await deleteDoc(doc(db, 'equipo', String(pokemon.id)))
      console.log("Pokemon eliminado correctamente")

    } catch (err) {
      console.log(err)
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
                <PokemonCard key={e.id} pokemon={e} select={select}/>
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
      <PokemonTeam team={team} remove={remove}/>
    </div>
  )
}

export default App 