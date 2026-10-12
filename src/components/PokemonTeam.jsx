import React from "react"

export const PokemonTeam = ({ team, remove }) => {
    return (
        <article className="pokemon-team">
            <header className="pokemon-team-heading">
                <h2>Mi equipo</h2>
                <span>{team.length}/6</span>
            </header>
            {team.length === 0 ? (
                <p className="pokemon-team-empty">Aún no hay Pokémon</p>
            ) : (
                <ul className="pokemon-team-list">
                    {team.map((pokemon) => (
                        <li className="pokemon-team-item" key={pokemon.id}>
                            <img src={pokemon.sprites.other['official-artwork'].front_default} className="pokemon-team-image"/>
                            <span className="pokemon-team-name">
                                <span>#{pokemon.id}</span>
                                <strong>{pokemon.name}</strong>
                            </span>
                            <button className="pokemon-team-remove" type="button" onClick={() => remove(pokemon)}>
                                ×
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </article>
    )   
}