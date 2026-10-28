const API = import.meta.env.VITE_POKEAPI_URL

export function selectPokemon(pokemon, team) {
    if (team.length == 6) return
    if (team.some((e) => e.id === pokemon.id)) return

    return pokemon
}

export function removePokemon(team, pokemon) {
    return team.filter((e) => e !== pokemon)
}

export async function loadPokemon(index) {
  try {
    const res = await fetch(`${API}?limit=50&offset=${index}`)
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