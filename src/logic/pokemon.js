const API = import.meta.env.VITE_POKEAPI_URL

export function selectPokemon(pokemon, team) {
    if (team.length == 6) return
    if (team.some((e) => e.id === pokemon.id)) return

    return pokemon
}

export function removePokemon(team, pokemon) {
    return team.filter((e) => e !== pokemon)
}
