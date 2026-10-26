import { db } from "../firebase"
import { doc, setDoc, deleteDoc, getDocs, collection } from "firebase/firestore"

const API = "https://pokeapi.co/api/v2/"

export function selectPokemon(pokemon, team) {
    if (team.length == 6) return
    if (team.some((e) => e.id === pokemon.id)) return

    return pokemon
}

export function removePokemon(team, pokemon) {
    return team.filter((e) => e !== pokemon)
}

export async function writeTeam(pokemon) {
    try {
      await setDoc(doc(db, 'equipo', String(pokemon.id)), {
        pokemon: pokemon
      })
    } catch (err) {
      console.log(err)
    }
}

export async function removeTeam(pokemon) {
    try {
        await deleteDoc(doc(db, 'equipo', String(pokemon.id)))
    } catch (err) {
      console.log(err)
    }
}

export async function loadTeam() {
  try {
    const snap = await getDocs(collection(db, 'equipo'))
    const team = snap.docs.map((data) => data.data().pokemon).filter(Boolean)

    return { team, error: null }
  } catch (err) {
    return { team: [], error: err.message }
  }
}

export async function loadPokemon(index) {
  try {
    const res = await fetch(`${API}pokemon/?limit=50&offset=${index}`)
    if (!res.ok) throw new Error(`Error en el fetch ("${res.status}")`)

    const { results } = await res.json()
    const query = await Promise.all(
      results.map(async ({ url }) => {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`Error en el fetch ("${response.status}")`)
        return response.json()
      })
    )

    return { query, error: null }
  } catch (err) {
    return { query: [], error: err.message }
  }
}